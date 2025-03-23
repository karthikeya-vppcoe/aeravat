from django.shortcuts import render
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from datetime import datetime, timedelta
from .models import WeekTask
from django.core.serializers.json import DjangoJSONEncoder
import google.generativeai as genai
import os
import requests
from bs4 import BeautifulSoup
import json
from json import dumps
from io import BytesIO
import PIL.Image
from django.views.decorators.csrf import csrf_exempt
import threading
import cv2
import speech_recognition as sr
import pyttsx3


def get_start_of_week(date_obj):
    # Calculate the Monday of the week for the given date
    return date_obj - timedelta(days=date_obj.weekday())

load_dotenv()

button_values = [
    "frontend", "backend", "devOps", "fullstack", "android", "postgresql", 
    "ai-and-data-scientist", "blockchain", "qa", "software-architect", 
    "aspnet-core", "flutter", "cyber-security", "ux-design", "react-native", 
    "game-developer", "technical-writer", "datastructures-and-algorithms", 
    "mlops", "computer-science", "react", "angular", "vue", "javascript", 
    "nodejs", "typescript", "python", "sql", "system-design", "java", 
    "spring-boot", "golang", "rust", "graphql"
]

def match_button_values(phases, details):
    matched_values = []

    # Convert phases and details to lowercase for case-insensitive matching
    combined_text = " ".join(phases + details).lower()

    # Specific cases for matching
    if "django" in combined_text:
        matched_values.append("backend")
    
    # General matching for other values
    for value in button_values:
        if value in combined_text:
            matched_values.append(value)
    
    return matched_values

from studentprofile.models import StudentProfile

def generate_content_with_gemini(prompt, model_name="gemini-1.5-pro", temperature=0.1):
    """Helper function to generate content with Google's Gemini models"""
    try:
        genai.configure(api_key=os.getenv("AIzaSyDpYP_CRG0QfO6l988NjyLWeiRGoC3itjs"))
        
        generation_config = {
            "temperature": temperature,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]
        
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text'):
            return response.text
        else:
            return "Error: Unable to generate content"
    
    except Exception as e:
        print(f"Error generating content: {e}")
        return f"Error: {e}"

def overall(request):
    skills = ''
    role = ''
    preferred_stack = ''
    
    student_profile = StudentProfile.objects.order_by('-id').first()
    
    if student_profile:
        skills = student_profile.skills
        role = student_profile.desired_role
        preferred_stack = student_profile.technology_interests
    
    context_prompt = f'''
    Act as an advisor for students by providing them a roadmap of things they should do to get their desired role in their dream company. 
    Give a generalised roadmap on the basis of their preferred stack with the main topics of importance and other main topics they should learn. 
    Give 7 phases. Basically give me a proper roadmap topics that one needs to master in order to get the desired role. 
    Note: Under each Phase give a Details: and attached with brief.
    
    Role: {role}
    Preferred stack to work with: {preferred_stack}
    '''
    
    result = generate_content_with_gemini(context_prompt)
    
    main_heading_match = re.search(r'\*\*([^*]+)\*\*', result)
    main_heading = main_heading_match.group(1) if main_heading_match else "Roadmap"
    
    phases = re.findall(r'\*{1,3}Phase \d+: ([^\*]+)\*{1,3}', result)
    details = re.findall(r'\*{1,3}Details:\*{1,3} ([^\*]+)', result, re.DOTALL)
    
    formatted_details = [detail.replace('*', '<br>') for detail in details]
    phase_detail_pairs = zip(phases, formatted_details)
    
    context = {
        'phase_detail_pairs': phase_detail_pairs,
    }
    
    return render(request, 'roadmap/overall.html', context)

def higher(request):
    future = 'higher'
    option = request.POST.get('future_plans', 'GRE')  # Default to GRE if not provided
    
    context_prompt = f'''
    Act as an advisor for engineering students by providing them a roadmap of things they should do for higher studies and crack the exam of {option}. 
    Give a generalised roadmap on the main topics along the lines of portion of {option}, courses and platforms/tutions, and other main topics they should learn. 
    Give 7 phases. Basically give me a proper roadmap of main topics that one needs to master in order to crack the {option}. 
    Note: Under each Phase give a Details:
    '''
    
    result = generate_content_with_gemini(context_prompt)
    
    main_heading_match = re.search(r'\*\*([^*]+)\*\*', result)
    main_heading = main_heading_match.group(1) if main_heading_match else "Roadmap"
    
    phases = re.findall(r'\*\*Phase \d+: ([^\n]+)', result)
    details = re.findall(r'\*\*Details:\*\*\n(.+?)(?=\n\n\*\*Phase|\Z)', result, re.DOTALL)
    
    formatted_details = [detail.replace('*', '<br>') for detail in details]
    phase_detail_pairs = zip(phases, formatted_details)
    
    matched_buttons = match_button_values(phases, details)
    
    context = {
        'phase_detail_pairs': phase_detail_pairs,
        'matched_buttons': matched_buttons,
        'selected_plan': option
    }
    
    return render(request, 'roadmap/higher.html', context)

def category(request):
    button_id = request.GET.get('roadmap', 'python')
    pdf_url = f"https://roadmap.sh/pdfs/roadmaps/{button_id}.pdf"
    
    pdf_response = requests.get(pdf_url)
    if pdf_response.status_code != 200:
        return HttpResponse("PDF not found.", status=404)
    
    user_input = request.POST.get('user_question', '')
    
    if user_input:
        context_prompt = f'''
        You are an AI educator which scrapes the pdf from the link given and provides the response to the users question in 500 words with additional links and resources for the users question. 
        If the user asks for a flowchart give a flowchart with explanation.
        
        Link: {pdf_url}
        User Question: {user_input}
        '''
        
        result = generate_content_with_gemini(context_prompt, temperature=0.9)
    else:
        result = ""
    
    return render(request, 'roadmap/roadmap.html', {
        'result': result, 
        'pdf_url': request.build_absolute_uri('/proxy_pdf/?url=' + pdf_url)
    })

def proxy_pdf(request, pdf_type):
    pdf_url = f"https://roadmap.sh/pdfs/roadmaps/{pdf_type}.pdf"
    
    pdf_response = requests.get(pdf_url)
    if pdf_response.status_code == 200:
        return HttpResponse(pdf_response.content, content_type='application/pdf')
    else:
        return HttpResponse("PDF not found.", status=404)

def personal(request):
    student_profile = StudentProfile.objects.order_by('-id').first()
    
    placement = student_profile.placement_year if student_profile else "May 2025"
    skills = student_profile.skills if student_profile else ""
    desired_role = student_profile.desired_role if student_profile else "Software Engineer"
    
    context_prompt = f'''
    Today's date is 8th march 2025.
    You need to give a personalised roadmap for students so that they can get their dream job.
    You will be given with the placement time, Skills they need to acquire, their current skills and proficiency in it.
    Calculate the weeks remaining from 8th march 2025 to the placement time and divide the skills they need to acquire into weekly basis. example Week 1: What they need to learn, etc.
    Make sure that each week has a detailed explanation of what needs to be done in 50 words, along with projects which will improve their current skill.
    After weeks of skill acquisition is completed, Give them suggestions of projects competitions hackathons, solving during skill acquisition side by side.
    Also the last week is reserved for interview preparation and practice. On the basis of this give me a detailed personalised roadmap.
    
    Placement Time: {placement}
    Required Skills: {skills}
    Desired role: {desired_role}
    '''
    
    result = generate_content_with_gemini(context_prompt)
    
    week_pattern = r'\*\*Week \d+:(.*?)\*\*Week \d+:|\Z'
    weeks_tasks_matches = re.findall(week_pattern, result, re.DOTALL)
    weeks_tasks = [week.strip() for week in weeks_tasks_matches if week.strip()]
    
    weeks_dict = {}
    weeks_tasks_dict_11_to_20 = {}
    
    for idx, task in enumerate(weeks_tasks):
        if idx < 10:
            weeks_dict[f"Week {idx + 1}"] = task.strip()
        elif idx < 20:
            weeks_tasks_dict_11_to_20[f"Week {idx + 1}"] = task.strip()
    
    start_date = datetime.now().date()  # Use the current date as the starting point
    for idx, (week, task) in enumerate(weeks_dict.items()):
        week_start_date = get_start_of_week(start_date + timedelta(weeks=idx))
        WeekTask.objects.create(date=week_start_date, task=task)
    
    return render(request, 'roadmap/personal.html', {'weeks_dict': weeks_dict})

def fullcalendar(request):
    week_tasks = WeekTask.objects.all()
    
    events = {}
    for task in week_tasks:
        end_time = task.date + timedelta(hours=4)
        
        events[task.id] = {
            'title': task.task,
            'start': task.date.isoformat(),
            'end': end_time.isoformat(),
        }
    
    data_json = dumps(events, cls=DjangoJSONEncoder)
    
    context = {'events_json': data_json}
    return render(request, 'roadmap/fullcalendar.html', context)

def hackathons(request):
    url = "https://devfolio.co/hackathons"
    
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    hackathon_links = soup.find_all("a", class_="Link__LinkBase-sc-af40de1d-0 lkflLS")
    hackathon_titles = soup.find_all("h3", class_="sc-KfMfS nZvkW")
    hackathon_dates = soup.find_all("p", class_="sc-KfMfS gfAHpl")
    participating_elements = soup.find_all("div", class_="sc-dSuTWQ hIXEQX")
    
    hackathons_data = []
    for link, title, date, participant_element in zip(hackathon_links, hackathon_titles, hackathon_dates, participating_elements):
        href = link["href"]
        title_text = title.text.strip()
        date_text = date.text.strip()
        
        participants_count = participant_element.find("p", class_="sc-KfMfS fuxoiZ").text.strip().split()[0]
        
        hackathons_data.append({
            "title": title_text,
            "link": href,
            "date": date_text,
            "participants_count": participants_count,
        })
    
    return render(request, 'pages/hackathons.html', {'hackathons': hackathons_data})



def select_domain(request):
    return render(request, 'roadmap/domain.html')

def startups(request):
    return render(request, 'roadmap/startups.html')

# Built-in questions
QUESTIONS = [
    "What is Django?",
    "What is a Django app?"
]

# Function to convert text to speech
def speak(text, language='en'):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

# Function to listen for user's response
def listen():
    recognizer = sr.Recognizer()
    microphone_index = 2  # Change this if needed
    with sr.Microphone(device_index=microphone_index) as source:
        print("Adjusting noise...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        speak("Recording started")
        print("Recording for 4 seconds...")
        try:
            recorded_audio = recognizer.listen(source, timeout=5)
            print("Done recording")

            print("Recognizing the text...")
            text = recognizer.recognize_google(
                recorded_audio, 
                language="en-US"
            )
            print("Decoded Text:", text)
            return text

        except sr.WaitTimeoutError:
            print("Listening timed out. No speech detected within 4 seconds.")
        except sr.UnknownValueError:
            print("Speech recognition could not understand audio.")
        except sr.RequestError as ex:
            print("Error fetching results from Google Speech Recognition service:", ex)

camera_thread = None

# Function to start the camera capture in a separate thread
def start_camera():
    global camera_thread
    if camera_thread is None or not camera_thread.is_alive():
        camera_thread = threading.Thread(target=start_camera_capture)
        camera_thread.daemon = True
        camera_thread.start()

# Main question view
flag = 0
def question_view(request):
    global flag
    if request.method == 'POST':
        question_index = request.POST.get('question_index', 0)
        if question_index.isdigit() and int(question_index) < len(QUESTIONS):
            question = QUESTIONS[int(question_index)]
            speak(question)  # Speak the question
            user_response = listen()  # Listen for user's response
            return JsonResponse({
                'question': question,
                'response': user_response,
                'question_index': int(question_index) + 1
            })
        else:
            # If the question index is out of range, indicate that all questions have been asked
            return JsonResponse({'all_questions_asked': True})
    # Start the camera capture in a separate thread
    if flag == 0:
        start_camera()
        flag = 1
    return render(request, 'roadmap/ai_interview.html')

def start_camera_capture():
    camera = cv2.VideoCapture(0)  # Use 0 for the default camera
    while True:
        success, frame = camera.read()
        if not success:
            break
    camera.release()

def get_pdf_text(pdf_docs):
    text = ""
    
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def resume_score(request):
    if request.method == 'POST':
        # Handle PDF upload
        pdf_docs = request.FILES.getlist('pdf_files')
        
        # Save resume to database
        from .models import Resume
        for pdf in pdf_docs:
            filename = pdf.name
            resume_obj = Resume(filename=filename, pdf_resume=pdf)
            resume_obj.save()
        
        # Extract text from PDF
        raw_text = get_pdf_text(pdf_docs)
        
        # Sample job description (in a real app, this would come from a database or user input)
        job_description = "Amazon Web developer. Needs to be proficient in Elastic Bean Stalk and Django, Html Javascript"
        
        # Create prompt for resume analysis
        prompt = f'''
        Act as a HR and you have to review resumes of candidates and give them a score out of 10 on the basis of how they match against the description of the job. 
        You will be provided with the job description, match it with the resume in the context and give it a score. The score can go up to 2 decimals. 
        Under it give few lines suggesting why the score is high or low and if the candidate's resume is matching the job description. 
        Also show a detailed math section on how the score has been calculated on the following basis: (Get each out of 10 points in decimals and score is the average of all)
        1. Degree and Education 
        2. Skills
        3. Experience

        First line of the response give this: (e.g. Format of the output: Score : (score), Degree and Education : (8.4)/10, Skills : (8.92)/10, Experience : (7.3)/10) Replace the scores with what you calculate
        
        Then explanation and Math of calculation of each score and summary.
        Give suggestions on how the candidate can improve their resume to fit the job description.

        Resume Content:
        {raw_text}

        Job Description:
        {job_description}
        '''
        
        # Get response from Gemini
        response_text = generate_content_with_gemini(prompt)
        
        # Extract scores using regex
        score_pattern = r"Score : \((\d+\.\d+)\)"
        degree_pattern = r"Degree and Education : \((\d+\.\d+)\)/10"
        skills_pattern = r"Skills : \((\d+\.\d+)\)/10"
        experience_pattern = r"Experience : \((\d+\.\d+)\)/10"

        resume_score_match = re.search(score_pattern, response_text)
        degree_match = re.search(degree_pattern, response_text)
        skills_match = re.search(skills_pattern, response_text)
        experience_match = re.search(experience_pattern, response_text)

        resume_score = degree_score = skills_score = experience_score = None

        if resume_score_match:
            resume_score = float(resume_score_match.group(1))
        if degree_match:
            degree_score = degree_match.group(1)
        if skills_match:
            skills_score = skills_match.group(1)
        if experience_match:
            experience_score = experience_match.group(1)

        # Update resume object with scores
        resume_obj.resume_score = resume_score
        resume_obj.degree_score = degree_score
        resume_obj.skills_score = skills_score
        resume_obj.experience_score = experience_score
        resume_obj.save()
        
        return render(request, 'roadmap/talkpdf.html', {
            'response_text': response_text,
            'resume_score': resume_score,
            'degree_score': degree_score,
            'skills_score': skills_score,
            'experience_score': experience_score,
        })
    
    return render(request, 'roadmap/talkpdf.html')

@csrf_exempt
def portion(request):
    if request.method == 'GET':
        return render(request, 'roadmap/portion.html')

    if request.method == 'POST':
        # Get the uploaded image from the request
        image = request.FILES.get('image')
        if image:
            img = PIL.Image.open(image)
            
            genai.configure(api_key=os.getenv("AIzaSyDpYP_CRG0QfO6l988NjyLWeiRGoC3itjs"))
            
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config={
                    "temperature": 0.9,
                    "top_p": 1,
                    "top_k": 1,
                    "max_output_tokens": 2048,
                },
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                ]
            )
            
            response = model.generate_content(
                ["Provided is the portion of the subject which I need help in. Please provide a timeline to study and revise the syllabus", img]
            )
            
            return JsonResponse({"text": response.text})
        else:
            return JsonResponse({"error": "No image provided"}, status=400)

def ai_bot(question):
    genai.configure(api_key=os.getenv("AIzaSyDpYP_CRG0QfO6l988NjyLWeiRGoC3itjs"))
    
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config={
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        },
        safety_settings=[
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]
    )
    
    response = model.generate_content(question)
    return response.text

def ai_bot_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question = data.get('question')
        
        response_text = ai_bot(question)
        
        return JsonResponse({'response': response_text})

    return render(request, 'roadmap/chatbot.html')

def download_roadmap_pdf(request):
    if request.method == 'POST':
        topic = request.POST.get('topic')
        
        # Instead of Selenium, we'll generate our own roadmap using Gemini
        prompt = f"""
        Create a detailed learning roadmap for {topic}. Break it down into the following sections:
        1. Getting Started - Fundamentals and prerequisites
        2. Core Concepts - Key knowledge areas to master
        3. Advanced Topics - In-depth specialized knowledge
        4. Practical Projects - Hands-on learning through implementation
        5. Resources - Books, courses, tutorials recommended
        
        For each section, provide 3-5 specific items to learn or do, with explanations.
        """
        
        roadmap_content = generate_content_with_gemini(prompt, temperature=0.7)
        
        context = {
            'topic': topic,
            'roadmap_content': roadmap_content,
        }
        
        return render(request, 'roadmap/newroad.html', context)
    
    return render(request, 'roadmap/newroad.html')