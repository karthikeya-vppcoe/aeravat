from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import * 
urlpatterns = [
    path('overall/',overall, name='overall'),
    path('higher/',higher, name='higher'),
    path('category/',category, name='category'),
    path('personal/',personal, name='personal'),
    path('fullcalendar/',fullcalendar, name='fullcalendar'),
    path('hackathons/',hackathons, name='hackathons'),
    path('proxy_pdf/<str:pdf_type>/', proxy_pdf, name='proxy_pdf'),
    path('domain/', select_domain, name='select_domain'),
    path('startups/', startups, name='startups'),
    path('interview/', question_view, name='question_view'),
    path('resume_score/', resume_score, name='resume_score'),
    path('portion/', portion, name='portion'),
    path('ai_bot', ai_bot_view, name='ai_bot'),
    path('download-roadmap/', download_roadmap_pdf, name='download_roadmap_pdf'),

]