# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-07-25 17:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0016_nondegreesharedreport1'),
    ]

    operations = [
        migrations.AddField(
            model_name='nondegreereport',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
