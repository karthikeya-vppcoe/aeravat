from django.shortcuts import render
from django.views.decorators.http import require_GET
import requests
# Create your views here.
def index(request):
    return render(request, 'base.html')


from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  # PyMuPDF
import re
from .models import Choice, StudentProfile

import re
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def find_information(text):
    """Finds specific information based on patterns."""
    info = {
        'name': None,
        'skills': [],
        'projects': [],
        'linkedin_profile': None,
        'email': None
    }
    # Regular expressions for matching patterns
 
def find_information(text):
    """Finds specific information based on patterns."""
    info = {
        'name': None,
        'skills': [],
        'projects': [],
        'linkedin_profile': None,
        'email': None
    }
    
    # Regular expressions for matching patterns
    name_pattern = re.compile(r"NAME\s*:\s*(.*)", re.IGNORECASE)
    skills_pattern = re.compile(r"SKILLS[\s\S]+?([\w\s,]+)\s*(?:\n|$)", re.IGNORECASE)
    projects_pattern = re.compile(r"Developed\s+(.*?)(?:Tech\s+Stack\s*:\s*(.*?))?\s*(?:$|\n)", re.IGNORECASE | re.DOTALL)
    linkedin_pattern = re.compile(r"Linkedin\s*:\s*(https?://[^\s]+)", re.IGNORECASE)
    email_pattern = re.compile(r"Email\s*:\s*([\w\.-]+@[\w\.-]+)", re.IGNORECASE)

    # Searching for matches in the text
    name_match = name_pattern.search(text)
    skills_match = skills_pattern.search(text)
    projects_matches = projects_pattern.findall(text)
    linkedin_match = linkedin_pattern.search(text)
    email_match = email_pattern.search(text)

    # Assigning matched information to the info dictionary
    if name_match:
        info['name'] = name_match.group(1).strip()
    if skills_match:
        info['skills'] = [skill.strip() for skill in skills_match.group(1).split(',')]
    for project, tech_stack in projects_matches:
        info['projects'].append({'name': project.strip(), 'tech_stack': tech_stack.strip()})
    if linkedin_match:
        info['linkedin_profile'] = linkedin_match.group(1).strip()
    if email_match:
        info['email'] = email_match.group(1).strip()

    return info

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import fitz  
import re
from django.http import HttpResponse
from .models import StudentProfile

# from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from .models import StudentProfile

# Your existing extract_text_from_pdf and find_information functions go here

def upload_pdf(request):
    if request.method == 'POST':
        if 'pdf_file' in request.FILES:
            pdf_file = request.FILES['pdf_file']
            fs = FileSystemStorage()
            filename = fs.save(pdf_file.name, pdf_file)
            pdf_path = fs.path(filename)
            text = extract_text_from_pdf(pdf_path)
            extracted_info = find_information(text)
            
            # Redirect back with extracted info to pre-fill form
            return render(request, 'student/uploadcv.html', {'info': extracted_info})
        else:
            # Simply save the form data into StudentProfile model without any additional logic
            student_profile = StudentProfile.objects.create(
                name=request.POST.get('name'),
                linkedin_profile=request.POST.get('linkedin_profile'),
                skills=request.POST.get('skills'),
                current_year = request.POST.get('current_year'),
                placement_year = request.POST.get('placement_year'),
                desired_role=request.POST.get('desired_role'),
                preferred_industry=request.POST.get('preferred_industry'),
                technology_interests=request.POST.get('technology_interests'),
                email=request.POST.get('email')  # Ensure this field is in your form
            )
            # Inside your form processing else block, after extracting other form fields



            student_profile.save()  # This line is technically redundant as `create()` saves the model instance already.
            return redirect('generate_quiz')  # Directly using the hardcoded URL for redirection

    else:
        # If it's a GET request, just show the form
        return render(request, 'student/uploadcv.html')


from django.shortcuts import render, get_object_or_404
from collections import defaultdict
from .models import Quiz, UserAnswer, StudentProfile, Question

def calculate_score(correct_answers, total_questions):
    return (correct_answers / total_questions * 100) if total_questions else 0

from django.shortcuts import redirect


def quiz_view(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = Question.objects.filter(quiz=quiz).prefetch_related('choice_set')
    # student_profile = get_object_or_404(StudentProfile, email=request.user.email)
    student_profile = StudentProfile.objects.order_by('-id').first()
    if request.method == 'POST':
        correct_answers = 0
        topic_performance = defaultdict(lambda: {'correct': 0, 'incorrect': 0})
        
        for question in questions:
            selected_choice_id = request.POST.get(str(question.id))
            if selected_choice_id:
                selected_choice = Choice.objects.get(id=selected_choice_id)
                UserAnswer.objects.create(
                    student_profile=student_profile,
                    question=question,
                    selected_choice=selected_choice
                )
                if selected_choice.is_correct:
                    correct_answers += 1
                    topic_performance[question.topic]['correct'] += 1
                else:
                    topic_performance[question.topic]['incorrect'] += 1

        total_questions = questions.count()
        score = calculate_score(correct_answers, total_questions)

        proficiency_level = 'Beginner'
        if score >= 80:
            proficiency_level = 'Advanced'
        elif score >= 50:
            proficiency_level = 'Intermediate'

        strengths, improvements = [], []
        for topic, performance in topic_performance.items():
            if performance['correct'] >= performance['incorrect']:
                strengths.append(topic)
            else:
                improvements.append(topic)

  

        # Prepare the context for rendering results
        context = {
            'quiz': quiz,
            'questions': questions,
            'score': score,
            'proficiency_level': proficiency_level,

            'show_results': True  # Flag to indicate that results should be shown
        }
        return redirect('quiz_results', quiz_id=quiz.id)

    else:
        context = {
            'quiz': quiz,
            'questions': questions,
            'show_results': True
        }
        return render(request, 'student/skill_assessment.html', context)


def quiz_results(request, quiz_id):
    # Fetch user's quiz answers
    student_profile = get_object_or_404(StudentProfile, email='kyathamaryan@gmail.com')
    user_answers = UserAnswer.objects.filter(student_profile=student_profile, question__quiz_id=quiz_id)
    total_questions = user_answers.count()
    correct_answers = sum(user_answer.is_correct() for user_answer in user_answers)
    score = calculate_score(correct_answers, total_questions)

    # Calculate proficiency level
    proficiency_level = 'Beginner'
    if score >= 80:
        proficiency_level = 'Advanced'
    elif score >= 50:
        proficiency_level = 'Intermediate'

    # Prepare question-wise results
    question_results = {}
    for user_answer in user_answers:
        question_text = user_answer.question.text
        is_correct = user_answer.is_correct()
        question_results[question_text] = is_correct

    # Calculate strengths and areas for improvement based on question topics
    topic_performance = defaultdict(lambda: {'correct': 0, 'incorrect': 0})
    for user_answer in user_answers:
        question = user_answer.question
        topic = question.topic
        if user_answer.is_correct():
            topic_performance[topic]['correct'] += 1
        else:
            topic_performance[topic]['incorrect'] += 1

    strengths, improvements = [], []
    for topic, performance in topic_performance.items():
        if performance['correct'] >= performance['incorrect']:
            strengths.append(topic)
        else:
            improvements.append(topic)
    print(strengths, improvements)
          # Prepare chart data after analyzing all topics
    strengths_chart_data = {
        'labels': [topic for topic in strengths],
        'datasets': [{
            'data': [topic_performance[topic]['correct'] for topic in strengths],
            'backgroundColor': ['#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#f44336'],
            'hoverOffset': 4
        }]
    }

    improvements_chart_data = {
        'labels': [topic for topic in improvements],
        'datasets': [{
            'data': [topic_performance[topic]['incorrect'] for topic in improvements],
            'backgroundColor': ['#f44336', '#ff9800', '#ffeb3b', '#2196f3', '#4caf50'],
            'hoverOffset': 4
        }]
    }
    print(strengths_chart_data,improvements_chart_data)
    context = {
        'score': score,
        'proficiency_level': proficiency_level,
        'total_questions': total_questions,
        'question_results': question_results,
    'strengths': strengths,  # Just pass the labels
    'improvements': improvements,  # Just pass the labels
    }
    return render(request, 'student/quiz_results.html', context)

def mentor(request):
    return render(request, 'student/mentor.html')


from django.shortcuts import render
from django.http import HttpResponse
import requests
# from serpapi import GoogleSearch

def display_courses(request):
    courses = []
    student_profile = StudentProfile.objects.order_by('-id').first()

    topic = student_profile.desired_role
    params = {
    "engine": "youtube",
    "search_query": topic,
    "gl": "in",
    "api_key": "9c1ab17159ab02de726c6b6e0b5c5f953973274486a539e410351fd515a2d3f1"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    courses = results.get('video_results', [])  # Safely get job results or empty list

    print(courses)
    return render(request, 'student/student_courses.html',{'courses': courses})
    
# from serpapi import GoogleSearch
# from django.shortcuts import render
# from serpapi import GoogleSearch

def job_listings(request):
    jobs = []  # Default empty state for jobs

    student_profile = StudentProfile.objects.order_by('-id').first()

    job_type =  student_profile.desired_role
    location = 'Mumbai'

    params = {
        "engine": "google_jobs",
        "google_domain": "google.co.in",
        "q": job_type,
        "hl": "hi",
        "gl": "in",
        "location": location,
        "api_key": "9c1ab17159ab02de726c6b6e0b5c5f953973274486a539e410351fd515a2d3f1"
    }


    search = GoogleSearch(params)
    results = search.get_dict()
    jobs = results.get('jobs_results', [])  # Safely get job results or empty list
    print(jobs)
    # Pass the jobs list to the template
    return render(request, 'student/jobs.html', {'jobs': jobs})


def dashboard(request):
    return render(request, 'student/dashboard.html')

from django.shortcuts import render
import requests

import requests
from requests.exceptions import ConnectTimeout, RequestException
from django.shortcuts import render

def profile(request):
    context = {}

    try:
        student_profile = StudentProfile.objects.latest('id')
        context['student_profile'] = student_profile
    except StudentProfile.DoesNotExist:
        context['error'] = "No student profile found."

    print(context)
    if 'username' in request.GET:
        username = request.GET['username']
        url = f"https://api.github.com/users/{username}/repos"
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for non-200 status codes
            repos = response.json() if response.status_code == 200 else []
            context['repos'] = repos
        except ConnectTimeout:
            error_message = "Connection to GitHub API timed out. Please try again later."
            context['error'] = error_message
        except RequestException as e:
            error_message = f"An error occurred while fetching data from GitHub API: {e}"
            context['error'] = error_message
    return render(request, 'student/profile.html', context)

def landing(request):
    return render(request, 'landing.html')


# Kleos 2.0 update

LEETCODE_SESSION = "<LEETCODE_SESSION>"
CSRFTOKEN = "<csrftoken>"

@require_GET
def get_questions(request):
    url = 'https://leetcode.com/graphql/'

    headers = {
        'Content-Type': 'application/json',
        'Cookie': f'LEETCODE_SESSION={LEETCODE_SESSION}; csrftoken={CSRFTOKEN}'
    }

    data = {
        "query": """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
        """,
        "variables": {
            "categorySlug": "",
            "skip": 0,
            "limit": 30,
            "filters": {}
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        questions = response.json().get('data', {}).get('problemsetQuestionList', {}).get('questions', [])

        # Organize questions by difficulty
        easy_questions = [q for q in questions if q['difficulty'] == 'Easy']
        medium_questions = [q for q in questions if q['difficulty'] == 'Medium']
        hard_questions = [q for q in questions if q['difficulty'] == 'Hard']

        context = {
            'easy': easy_questions,
            'medium': medium_questions,
            'hard': hard_questions
        }

        print("Context is ++++++++++++++++++>>>>>>>>>",context)

        return render(request, 'roadmap/questions.html', context)
    else:
        context = {"error": "Failed to fetch data from LeetCode"}
        return render(request, 'roadmap/questions.html', context)
    

def confusion_form_page(request):
    return render(request, 'roadmap/confused_form.html')

import os

import google.generativeai as genai


genai.configure(api_key="AIzaSyCqqYf83NchDSgwQWOeVXFDU5yZY7u45ck")

# Create the Gemini model with generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    # "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

def handle_confused_form(request):
    if request.method == 'POST':
        # Get all form data
        user_input = {
            'financial_support': request.POST.get('financial_support'),
            'financial_budget': request.POST.get('financial_budget'),
            'location': request.POST.get('location'),
            'coding_interest': request.POST.get('coding_interest'),
            'engineering_subjects': request.POST.getlist('engineering_subjects[]'),  # Multiple select
            'strengths': request.POST.get('strengths'),
            'work_preference': request.POST.get('work_preference'),
            'leadership': request.POST.get('leadership'),
            'long_term_goals': request.POST.get('long_term_goals'),
            'sector_preference': request.POST.get('sector_preference'),
            'salary_expectations': request.POST.get('salary_expectations'),
            'cgpa': request.POST.get('cgpa'),
            'exam_comfort': request.POST.get('exam_comfort'),
            'exam_dedication': request.POST.get('exam_dedication'),
            'risk_preference': request.POST.get('risk_preference'),
            'work_life_balance': request.POST.get('work_life_balance'),
            'environment_preference': request.POST.get('environment_preference'),
            'internship_experience': request.POST.get('internship_experience'),
            'extracurricular_activities': request.POST.get('extracurricular_activities'),
            'mentors': request.POST.get('mentors'),
            'open_to_other_fields': request.POST.get('open_to_other_fields'),
            'additional_info': request.POST.get('additional_info'),
        }

        # Create a chat session with Gemini
        chat_session = model.start_chat(
            history=[]
        )

        # Craft a prompt using the user_input dictionary
        # For example:
        prompt = f"""
        Based on the following information, suggest a suitable career path for this individual:
        Financial Background: {user_input['financial_support']} (Budget: {user_input['financial_budget']})
        Location: {user_input['location']}
        Interests: {user_input['coding_interest']} (Engineering Subjects: {', '.join(user_input['engineering_subjects'])})
        Strengths: {user_input['strengths']}
        Work Preferences: {user_input['work_preference']} (Leadership: {user_input['leadership']})
        Career Goals: {user_input['long_term_goals']}
        Sector Preference: {user_input['sector_preference']} (Salary Expectations: {user_input['salary_expectations']})
        Academic Performance: CGPA: {user_input['cgpa']} (Exam Comfort: {user_input['exam_comfort']}, Dedication: {user_input['exam_dedication']})
        Personality: Risk Preference: {user_input['risk_preference']} (Work-Life Balance: {user_input['work_life_balance']}, Environment: {user_input['environment_preference']})
        Exposure: {user_input['internship_experience']} (Extracurricular: {user_input['extracurricular_activities']}, Mentors: {user_input['mentors']})
        Open to Other Fields: {user_input['open_to_other_fields']}
        Additional Info: {user_input['additional_info']}
        """

        # Send the prompt to Gemini
        response = chat_session.send_message(prompt)

        # Redirect to the result page with the response
        return redirect(f'/result?response={response.text}')

    return render(request, 'roadmap/confused_form.html')

import re

def show_result(request):
    response = request.GET.get('response')

    return render(request, 'roadmap/result.html', {'response':response})


def update_kts_page(request):
    return render(request, 'roadmap/update_kts.html')


from django.shortcuts import render, HttpResponse
from serpapi import GoogleSearch


# views.py
from django.shortcuts import render, HttpResponse
from serpapi import GoogleSearch

def handle_update_kts(request):
    if request.method == 'POST':
        # Get all subjects from the form
        subjects = []
        for key in request.POST.keys():
            if key.startswith('subject-'):
                subjects.append(request.POST.get(key))

        # Prepare data for API call
        api_data = {}
        for subject in subjects:
            # Use SerpAPI to get YouTube search results
            params = {
                "engine": "youtube",
                "search_query": f"{subject} tutorial",
                "api_key": "9c1ab17159ab02de726c6b6e0b5c5f953973274486a539e410351fd515a2d3f1"
            }

            search = GoogleSearch(params)
            results = search.get_dict()
            
            if 'video_results' in results:
                api_data[subject] = [
                    {
                        "link": result['link'],
                        "title": result['title'],
                        "type": 'video'
                    } for result in results['video_results']
                ]
            else:
                api_data[subject] = []  # No results found

        # Render the results to the template
        return render(request, 'roadmap/kt_result.html', {'api_data': api_data})
    else:
        return HttpResponse("Invalid request")

def suggestProjects_and_newSkills(request):
    student_profile = StudentProfile.objects.get(email = "kyathamaryan@gmail.com")
    skills = student_profile.skills.split(',')  # Assuming skills are stored as a comma-separated string

    # Prepare the prompt for Gemini
    prompt = f"I am a student with these skills: {', '.join(skills)}. Suggest some projects I can work on to develop my skills further. Also, suggest new skills I should learn to enhance my abilities."

    chat_session = model.start_chat(
    history=[
    ]
    )

    # Send the request to Gemini API
    response = chat_session.send_message(prompt)

    response_text = re.sub(r'\*|\*\*', '\n', response.text)

    print("rESPONSE+>>>>>>>>>>>>>>>>>>>>>>>",response_text)
    return render(request, 'roadmap/skills_and_projects.html', {"response_data":response_text})



from django.shortcuts import render
from .models import StudentProfile
import re

def generate_quiz(request):
    student_profile = StudentProfile.objects.order_by('-id').first()
    desired_job = student_profile.desired_role

    # Prepare the prompt for Gemini
    prompt = f"I am a student give me list of 5 questions and mcqs in format on topic {desired_job} 1. Question a. op1, b. op2, c. op3, d. op4."

    chat_session = model.start_chat(
        history=[]
    )

    # Send the request to Gemini API
    response = chat_session.send_message(prompt)

    # Process the response text
    response_text = response.text
    questions = []

    # Split response into individual questions
    question_parts = re.split(r'\d+\.\s', response_text)[1:]

    for part in question_parts:
        question_match = re.match(r'(.+?)(?:\s+[a-d]\.\s)', part)
        if question_match:
            question_text = question_match.group(1).strip()
            options = re.findall(r'[a-d]\.\s(.+?)(?=\s+[a-d]\.\s|$)', part)
            questions.append({
                'question': question_text,
                'options': options
            })

    context = {
        'questions': questions,
        'desired_job' :desired_job,
    }

    return render(request, 'roadmap/generate_quiz.html', context)