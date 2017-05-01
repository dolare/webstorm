# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-04-26 19:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0004_auto_20170314_0219'),
    ]

    operations = [
        migrations.AddField(
            model_name='enhancementupdate',
            name='prev_diff',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='universitycustomer',
            name='is_demo',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='enhancement',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='none_degree',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='whoops',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='whoopsupdate',
            name='prev_diff',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]