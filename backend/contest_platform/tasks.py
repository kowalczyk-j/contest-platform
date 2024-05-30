import dramatiq
from django.core.mail import send_mass_mail, EmailMessage
from django.utils import timezone
import datetime

# from .models import Contest


@dramatiq.actor
def send_email_task(messages):
    send_mass_mail(messages, fail_silently=False)


@dramatiq.actor
def update_contest_status():
    today = timezone.now().date()

    # Change status to 'ongoing' if date_start is today
    Contest.objects.filter(date_start=today, status="not_started").update(
        status="ongoing"
    )

    # Change status 'judging' if date_end was yesterday
    yesterday = today - datetime.timedelta(days=1)
    Contest.objects.filter(date_end=yesterday, status="ongoing").update(
        status="judging"
    )


@dramatiq.actor
def send_certificate_task(subject, message, first_name, last_name, email, pdf_content):
    email = EmailMessage(
        subject,
        message,
        "konkursy.bowarto@gmail.com",
        [email],
    )
    email.attach(
        f"{first_name}_{last_name}_certificate.pdf", pdf_content, "application/pdf"
    )
    email.send(fail_silently=False)


# @dramatiq.actor
# def update_contest_status():
#     today = timezone.now().date()

#     # Change status to 'ongoing' if date_start is today
#     Contest.objects.filter(date_start=today, status='not_started').update(status='ongoing')

#     # Change status 'judging' if date_end was yesterday
#     yesterday = today - datetime.timedelta(days=1)
#     Contest.objects.filter(date_end=yesterday, status='ongoing').update(status='judging')
