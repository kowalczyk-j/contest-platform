import dramatiq
from django.core.mail import send_mail


@dramatiq.actor
def send_email_task(subject, message, receiver_emails):
    send_mail(subject, message, "konkursy.bowarto@gmail.com", receiver_emails, fail_silently=False)