from django.db import models


class Contest(models.Model):
    title = models.CharField(max_length=200, default='')
    description = models.CharField(max_length=1800, default='')

    objects = models.Manager()
