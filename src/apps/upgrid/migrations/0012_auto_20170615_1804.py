# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-06-15 18:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('upgrid', '0011_auto_20170613_1806'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customerfeaturemapping',
            name='customer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomer'),
        ),
        migrations.RemoveField(
            model_name='customerfeaturemapping',
            name='feature',
        ),
        migrations.AddField(
            model_name='customerfeaturemapping',
            name='feature',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='upgrid.CustomerFeature'),
        ),
    ]
