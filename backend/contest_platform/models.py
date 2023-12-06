from django.db import models


class Contest(models.Model):
    title = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=1800, default="")

    def __str__(self):
        return f"Contest: {self.title, self.description}"


class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    # Add other fields as needed

    def __str__(self):
        return self.username
