from django.contrib import admin
from competitions.models import Category, Competition, Goal, Participant

admin.site.register(Category)
admin.site.register(Competition)
admin.site.register(Goal)
admin.site.register(Participant)