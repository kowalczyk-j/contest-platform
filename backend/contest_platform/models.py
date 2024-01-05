from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser


class Contest(models.Model):
    title = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=1800, default="")
    date_start = models.DateField(default=date(2023, 3, 15))
    date_end = models.DateField(default=date.today)
    # 1 - konkurs indywidualny; 0 - konkurs grupowy
    individual = models.BooleanField(default=True)
    type = models.CharField(max_length=50, default="")
    rules_pdf = models.BinaryField(null=True)
    poster_img = models.BinaryField(null=True)

    def __str__(self):
        return f"{self.title, self.description}"


class AssessmentCriterion(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    description = models.CharField(max_length=500)
    max_rating = models.IntegerField()


class Address(models.Model):
    street = models.CharField(max_length=50)
    number = models.CharField(max_length=10)
    postal_code = models.CharField(max_length=6)
    city = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street} {self.number}, {self.postal_code} {self.city}"


class Entry(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    contestant_name = models.CharField(max_length=20)
    parent_name = models.CharField(max_length=20, null=True)
    contestant_surname = models.CharField(max_length=50)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    email = models.EmailField(null=True)
    entry_title = models.CharField(max_length=100)
    entry_file = models.BinaryField(null=True)


class User(AbstractUser):
    is_jury = models.BooleanField(default=False)
