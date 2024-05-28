from django.db import models
from django.utils import timezone
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from .tasks import send_email_task

# REQ_09A
class Contest(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Nierozpoczęty'),
        ('ongoing', 'W trakcie trwania'),
        ('judging', 'W trakcie oceny'),
        ('finished', 'Zakończony'),
    ]

    title = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=1800, default="")
    date_start = models.DateField(default=date.today)
    date_end = models.DateField(default=date.today)
    # 1 - konkurs indywidualny; 0 - konkurs grupowy
    individual = models.BooleanField(default=True)
    type = models.CharField(max_length=50, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    rules_pdf = models.URLField(max_length=300, null=True)
    poster_img = models.URLField(max_length=300, null=True)

    def __str__(self):
        return f"{self.title, self.description}"

    def save(self, *args, **kwargs):
        today = timezone.now().date()
        if self.status != 'finished':
            if self.date_start <= today < self.date_end and self.status != 'ongoing':
                self.status = 'ongoing'
            elif today >= self.date_end and self.status != 'judging':
                self.status = 'judging'
        super().save(*args, **kwargs)
# REQ_09A_END


class Address(models.Model):
    street = models.CharField(max_length=50)
    number = models.CharField(max_length=10)
    postal_code = models.CharField(max_length=6)
    city = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street} {self.number}, {self.postal_code} {self.city}"


# REQ_23
class Person(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=50)


# REQ_23_END


# REQ_06A
# REQ_23B
class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_jury = models.BooleanField(default=False)
    is_coordinating_unit = models.BooleanField(default=False)
    is_newsletter_subscribed = models.BooleanField(default=False)


# REQ_06A_END
# REQ_23B_END


# REQ_24
class Entry(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    contestants = models.ManyToManyField(Person)
    date_submitted = models.DateField(default=date.today)
    email = models.EmailField(null=True)
    entry_title = models.CharField(max_length=100)
    entry_file = models.URLField(max_length=300, null=True)
    favourite = models.BooleanField(default=False)
    canceled = models.BooleanField(default=False)
# REQ_24_END


# REQ_09B
class GradeCriterion(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.PROTECT)
    description = models.CharField(max_length=500)
    max_rating = models.IntegerField()
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)


# REQ_09B_END


class Grade(models.Model):
    criterion = models.ForeignKey(GradeCriterion, on_delete=models.PROTECT)
    entry = models.ForeignKey(Entry, on_delete=models.PROTECT)
    value = models.IntegerField(null=True)
    description = models.CharField(max_length=255, default="")

    def clean(self):
        if self.value > self.criterion.max_rating:
            raise ValidationError(
                {
                    "value": "Value must be less than or equal to the max \
            rating of the criterion."
                }
            )


class School(models.Model):
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    building_number = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10, blank=True, null=True)
    postal_code = models.CharField(max_length=20)
    city = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    fax = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    audience_status = models.CharField(max_length=20)
    institution_specifics = models.CharField(max_length=255)
    director_name = models.CharField(max_length=255)

    class Meta:
        unique_together = (
            "name",
            "street",
            "building_number",
        )

    def __str__(self):
        return f"{self.name}"


@receiver(post_save, sender=Entry)
def send_confirmation_email(sender, instance, created, **kwargs):
    if created:
        contest_title = instance.contest.title
        receiver_email = instance.email
        host_email = settings.EMAIL_HOST_USER

        subject = f'Potwierdzenie zgłoszenia pracy do konkursu "{contest_title}"'
        message = f"""Szanowny Panie/ Szanowna Pani,

            Dziękujemy za wzięcie udziału w konkursie \"{contest_title}\"
            organizowanym przez Fundację "BoWarto". Praca została przyjęta i oczekuje na ocenę.

            Zachęcamy do wzięcie udziału w następnych konkursach i życzymy powodzenia!

            Z poważaniem,
            Zespół Fundacji \"BoWarto\" """
        messages = [
            (subject, message, host_email, [receiver_email])
        ]
        send_email_task.send(messages)