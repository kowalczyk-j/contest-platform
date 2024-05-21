import dramatiq
import datetime
from django.utils import timezone
from .models import Contest
from django.core.mail import send_mail


@dramatiq.actor
def send_email_task(subject, message, receiver_emails):
    send_mail(
        subject,
        message,
        "konkursy.bowarto@gmail.com",
        receiver_emails,
        fail_silently=False,
    )

@dramatiq.actor
def update_contest_status():
    today = timezone.now().date()
    
    # Change status to 'ongoing' if date_start is today
    Contest.objects.filter(date_start=today, status='not_started').update(status='ongoing')
    
    # Change status 'judging' if date_end was yesterday
    yesterday = today - datetime.timedelta(days=1)
    Contest.objects.filter(date_end=yesterday, status='ongoing').update(status='judging')