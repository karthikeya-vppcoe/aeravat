# Generated by Django 4.1.7 on 2024-03-22 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StudentProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('linkedin_profile', models.URLField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('skills', models.CharField(blank=True, max_length=1000, null=True)),
                ('projects', models.CharField(blank=True, max_length=1000, null=True)),
                ('desired_role', models.CharField(blank=True, max_length=100, null=True)),
                ('preferred_industry', models.CharField(blank=True, max_length=100, null=True)),
                ('technology_interests', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
