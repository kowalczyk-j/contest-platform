import dramatiq
from django.core.mail import send_mass_mail


@dramatiq.actor
def send_email_task(messages):
    send_mass_mail(messages, fail_silently=False)
