# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-06-15 18:37
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0013_auto_20170615_1836'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customerfeaturemapping',
            options={'default_permissions': ('add', 'change', 'delete', 'view_only')},
        ),
        migrations.RemoveField(
            model_name='customerfeaturemapping',
            name='description',
        ),
        migrations.RemoveField(
            model_name='customerfeaturemapping',
            name='name',
        ),
    ]
