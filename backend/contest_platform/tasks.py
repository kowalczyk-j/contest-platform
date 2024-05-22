import dramatiq
from django.core.mail import send_mass_mail
from django.utils import timezone
import datetime
from .models import Contest


@dramatiq.actor
def send_email_task(messages):
    send_mass_mail(messages, fail_silently=False)


@dramatiq.actor
def update_contest_status():
    today = timezone.now().date()
    
    # Change status to 'ongoing' if date_start is today
    Contest.objects.filter(date_start=today, status='not_started').update(status='ongoing')
    
    # Change status 'judging' if date_end was yesterday
    yesterday = today - datetime.timedelta(days=1)
    Contest.objects.filter(date_end=yesterday, status='ongoing').update(status='judging')
