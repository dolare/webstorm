# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-05-15 21:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0006_universitycustomer_can_ccemail'),
    ]

    operations = [
        migrations.AddField(
            model_name='upgridaccountmanager',
            name='modify_user',
            field=models.BooleanField(default=False),
        ),
    ]