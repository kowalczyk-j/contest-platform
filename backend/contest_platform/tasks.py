import dramatiq
from django.core.mail import send_mass_mail, EmailMessage
from weasyprint import HTML
from django.template.loader import render_to_string
import base64


@dramatiq.actor
def send_email_task(messages):
    send_mass_mail(messages, fail_silently=False)


@dramatiq.actor
def send_certificate_task(
        subject,
        message,
        first_name,
        last_name,
        email,
        pdf_base64
        ):
    pdf_content = base64.b64decode(pdf_base64)

    email_message = EmailMessage(
        subject,
        message,
        "konkursy.bowarto@gmail.com",
        [email],
    )
    email_message.attach(
        f"{first_name}_{last_name}_certificate.pdf",
        pdf_content,
        "application/pdf"
    )
    email_message.send(fail_silently=False)


@dramatiq.actor
def send_certificates_task(
    user_details,
    signatory,
    signature,
    description,
    achievement,
    certificate_template_path,
):
    for first_name, last_name, email in user_details:
        data = {
            "participant": f"{first_name} {last_name}",
            "achievement": achievement,
            "email": email,
            "signatory": signatory,
            "signature": signature,
            "contest": description,
        }
        html_string = render_to_string(certificate_template_path, data)
        html = HTML(string=html_string)
        pdf = html.write_pdf()

        # Zakodowanie pliku PDF do Base64
        pdf_base64 = base64.b64encode(pdf).decode('utf-8')

        subject = "Dyplom uznania - fundacja BoWarto"
        message = "Dziękujemy za udział i zachęcamy do zgłaszania prac w przyszłych konkursach! \
              W załaczniku tej wiadomości znajduje się Twój dyplom do pobrania."
        send_certificate_task.send(
            subject,
            message,
            first_name,
            last_name,
            email,
            pdf_base64)
