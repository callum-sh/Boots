# Generated by Django 5.1.4 on 2025-01-26 01:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competitions', '0012_alter_competition_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 23, 1, 16, 51, 330448, tzinfo=datetime.timezone.utc)),
        ),
    ]
