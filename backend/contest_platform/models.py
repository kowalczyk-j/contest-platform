from django.db import models
from datetime import date


class Contest(models.Model):
    title = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=1800, default="")
    date_start = models.DateField(default=date.today)
    date_end = models.DateField(default=date.today)
    # 1 - konkurs indywidualny; 0 - konkurs grupowy
    individual = models.BooleanField(default=True)
    type = models.CharField(max_length=50, default="")
    rules_pdf = models.BinaryField(null=True)
    poster_img = models.BinaryField(null=True)

    def __str__(self):
        return f"Contest: {self.title, self.description}"
