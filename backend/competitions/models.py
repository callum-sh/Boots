from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


def default_end_date():
    return timezone.now() + timezone.timedelta(weeks=4)


class Competition(models.Model):
    """
    A competition in which the winner gets a free boot. 
    
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=default_end_date)
    categories = models.ManyToManyField('Category', related_name='competitions')
    admins = models.ManyToManyField(User, related_name='admin_competitions', blank=True)
    # iMessage group chat this competition is run from (BlueBubbles chat guid)
    chat_guid = models.CharField(max_length=255, blank=True, db_index=True)
    # set once the end-of-competition summary has been sent to the chat
    summary_sent_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    

class Category(models.Model):
    """
    A category for a goal.

    Ex: Wakeup Time, Exercise, etc.
    """
    name = models.CharField(max_length=100)
    public = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    

class Participant(models.Model):
    """
    A participant in a competition.

    """
    # null for chat-only people who have no app login
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competitions_joined', null=True, blank=True)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='participants', null=True)
    score = models.IntegerField(default=0)
    # iMessage address: +15551234567 or an email
    handle = models.CharField(max_length=255, blank=True, db_index=True)
    display_name = models.CharField(max_length=100, blank=True)

    @property
    def name(self):
        if self.display_name:
            return self.display_name
        if self.user:
            return self.user.first_name or self.user.username
        return f"…{self.handle[-4:]}" if self.handle else f"Participant {self.pk}"

    def __str__(self):
        return self.name
    
    
class Goal(models.Model):
    """
    A participant's interpretation of a competition category.

    ex: Callum will wakeup at 6am. Jacob will wakeup at 9am (lazy)
    """
    class Cadence(models.TextChoices):
        DAILY = 'daily'
        WEEKLY = 'weekly'
        TOTAL = 'total'

    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='goals')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='goals')
    description = models.CharField(max_length=255)
    achieved = models.BooleanField(default=False)
    achieved_at = models.DateTimeField(null=True, blank=True)
    metric = models.CharField(max_length=50, blank=True)  # "km", "pages", "wake time", "bool"
    target = models.FloatField(null=True, blank=True)
    cadence = models.CharField(max_length=10, choices=Cadence.choices, default=Cadence.DAILY)
    source_message = models.ForeignKey('chat.ChatMessage', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return f"{self.description} [{self.category.name}]"


class GoalUpdate(models.Model):
    """
    One progress entry for a goal on a given day.

    Corrections append a new row and point the old one at it via superseded_by.
    """
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='updates')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='updates')
    for_date = models.DateField()
    value = models.FloatField(null=True, blank=True)
    met = models.BooleanField(null=True, blank=True)
    note = models.CharField(max_length=255, blank=True)
    source_message = models.ForeignKey('chat.ChatMessage', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    superseded_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supersedes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['goal', 'for_date'])]

    def __str__(self):
        return f"{self.goal} @ {self.for_date}"
