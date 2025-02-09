# Generated by Django 5.1.4 on 2025-02-25 15:46

import datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competitions', '0002_alter_competition_end_date'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 25, 15, 46, 53, 539636, tzinfo=datetime.timezone.utc)),
        ),
        migrations.CreateModel(
            name='Invite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('competition', models.ManyToManyField(related_name='invites', to='competitions.competition')),
                ('user', models.ManyToManyField(related_name='invites', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
