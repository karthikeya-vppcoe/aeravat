from django.db import models

# Create your models here.
class WeekTask(models.Model):
    date = models.DateField()
    task = models.TextField()

    def _str_(self):
        return f"{self.date}: {self.task}"


class Resume(models.Model):
    filename = models.CharField(max_length=255)
    pdf_resume = models.FileField(upload_to='pdf_resumes/')
    resume_score = models.FloatField(null=True)
    degree_score = models.FloatField(null=True)
    skills_score = models.FloatField(null=True)
    experience_score = models.FloatField(null=True)

    def str(self):
        return self.filename