from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Competition(models.Model):
    """
    A competition in which the winner gets a free boot. 
    
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now() + timezone.timedelta(weeks=4))
    categories = models.ManyToManyField('Category', related_name='competitions')
    admins = models.ManyToManyField(User, related_name='admin_competitions')
    
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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competitions_joined')
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='participants', null=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}"
    
    def create_todays_goals(self):
        """
        Create daily goals for each category in current competition (if not existing).
        """
        today = timezone.now().date()
        
        for category in self.competition.categories.all():
            goal_exists = Goal.objects.filter(participant=self, category=category, date=today).exists()
            
            if not goal_exists:
                Goal.objects.create(participant=self, category=category, description="todo", date=today)
    
    
class Goal(models.Model):
    """
    A participant's interpretation of a competition category.

    ex: Callum will wakeup at 6am. Jacob will wakeup at 9am (lazy)
    """
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='goals')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='goals')
    description = models.CharField(max_length=255)
    achieved = models.BooleanField(default=False)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.description} [{self.category.name}]"