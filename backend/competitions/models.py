from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class Participant(models.Model):
    """
    A participant in a competition.

    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="competitions_joined"
    )
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}"


class Competition(models.Model):
    """
    A competition in which the winner gets a free boot.

    """

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(
        default=timezone.now() + timezone.timedelta(weeks=4)
    )
    categories = models.ManyToManyField("Category", related_name="competitions")
    participants = models.ManyToManyField("Participant", related_name="competitions")
    owner = models.ForeignKey(
        Participant, on_delete=models.CASCADE, related_name="competitions_owned"
    )

    def __str__(self):
        return self.name


class Category(models.Model):
    """
    A category for a goal.

    Ex: Wakeup Time, Exercise, etc.
    """

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Goal(models.Model):
    """
    A participant's interpretation of a competition category.

    ex: Callum will wakeup at 6am. Jacob will wakeup at 9am (lazy)
    """

    participant = models.ForeignKey(
        Participant, on_delete=models.CASCADE, related_name="goals"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="goals"
    )
    description = models.CharField(max_length=255)
    achieved = models.BooleanField(default=False)
    achieved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.description} [{self.category.category.name}]"
