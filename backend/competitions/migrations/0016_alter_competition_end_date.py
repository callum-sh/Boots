# Generated by Django 5.1.4 on 2025-01-22 18:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competitions', '0015_merge_20250122_1755'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 19, 18, 31, 59, 930293, tzinfo=datetime.timezone.utc)),
        ),
    ]
