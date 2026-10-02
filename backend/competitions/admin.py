from django.contrib import admin
from competitions.models import Category, Competition, Goal, GoalUpdate, Participant

admin.site.register(Category)
admin.site.register(Competition)
admin.site.register(Goal)
admin.site.register(Participant)
admin.site.register(GoalUpdate)
