# Generated by Django 5.1.4 on 2025-02-25 22:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competitions', '0002_alter_competition_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 25, 22, 56, 17, 219780, tzinfo=datetime.timezone.utc)),
        ),
    ]
