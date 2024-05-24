import dramatiq
from django.core.mail import send_mail, EmailMessage


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
def send_certificate_task(
        subject,
        message,
        first_name,
        last_name,
        email,
        pdf_content
        ):
    email = EmailMessage(
        subject,
        message,
        "konkursy.bowarto@gmail.com",
        [email],
    )
    email.attach(
        f"{first_name}_{last_name}_certificate.pdf",
        pdf_content,
        "application/pdf")
    email.send(fail_silently=False)
