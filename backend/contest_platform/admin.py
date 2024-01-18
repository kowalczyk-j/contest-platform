from django.contrib import admin
from .models import (Contest, User, GradeCriterion, Address, Entry, Person,
                     Grade, School)

# Register your models here.

admin.site.register(Contest)
admin.site.register(User)
admin.site.register(GradeCriterion)
admin.site.register(Address)
admin.site.register(Entry)
admin.site.register(Person)
admin.site.register(Grade)
admin.site.register(School)
