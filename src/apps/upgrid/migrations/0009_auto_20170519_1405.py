# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-05-19 14:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0008_auto_20170517_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='universitycustomer',
            name='position_level',
            field=models.CharField(choices=[('university', 'University'), ('School', 'School'), ('acd_dep', 'Academic_Department'), ('admin_dep', 'Administrative_Department'), ('program', 'Program')], default='University', max_length=50, null=True),
        ),
    ]
