# Generated by Django 5.1.4 on 2025-01-19 13:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competitions', '0005_alter_competition_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 16, 13, 18, 51, 860606, tzinfo=datetime.timezone.utc)),
        ),
    ]
