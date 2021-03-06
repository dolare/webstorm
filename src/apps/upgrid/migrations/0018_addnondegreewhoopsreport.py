# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-08-15 18:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('ceeb_program', '0034_nondegreecourse_location_info'),
        ('upgrid', '0017_nondegreereport_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='NonDegreeWhoopsReport',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('note', models.TextField(blank=True, null=True)),
                ('active', models.BooleanField(default=True)),
                ('university_school', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='non_degree_whoops_report', to='ceeb_program.UniversitySchool')),
            ],
            options={
                'default_permissions': ('add', 'change', 'delete', 'view_only'),
                'abstract': False,
                'ordering': ['-date_created'],
            },
        ),
    ]
