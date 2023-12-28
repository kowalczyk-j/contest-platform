from django.contrib import admin
from .models import Address, AssessmentCriterion, Contest, Entry

# Register your models here.

admin.site.register([Address, AssessmentCriterion, Contest, Entry])
