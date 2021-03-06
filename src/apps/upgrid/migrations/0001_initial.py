# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-04 16:29
from __future__ import unicode_literals

import datetime
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ceeb_program', '0009_auto_20161010_0218'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClientAndProgramRelation',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
            options={
                'abstract': False,
                'default_permissions': ('add', 'change', 'delete', 'view_only'),
            },
        ),
        migrations.CreateModel(
            name='CustomerCompetingProgram',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('order', models.IntegerField(blank=True, null=True)),
                ('enhancement_status', models.CharField(choices=[('in_progress', 'In_Progress'), ('done', 'Done')], default='in_progress', max_length=50)),
            ],
            options={
                'abstract': False,
                'default_permissions': ('add', 'change', 'delete', 'view_only'),
            },
        ),
        migrations.CreateModel(
            name='EnhancementReports',
            fields=[
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('er_created', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('er_enhancement_report', models.BinaryField(blank=True, null=True)),
                ('er_token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('er_customer_program', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ceeb_program.Program')),
            ],
        ),
        migrations.CreateModel(
            name='UniversityCustomerProgram',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('whoops_status', models.CharField(choices=[('in_progress', 'In_Progress'), ('done', 'Done')], default='in_progress', max_length=50)),
                ('whoops_final_release', models.CharField(choices=[('True', 'Released'), ('False', 'Unreleased')], default='False', max_length=20)),
                ('enhancement_final_release', models.CharField(choices=[('True', 'Released'), ('False', 'Unreleased')], default='False', max_length=20)),
                ('customer_confirmation', models.CharField(choices=[('Yes', 'Confirmed'), ('No', 'Not Confirmed')], default='No', max_length=20)),
            ],
            options={
                'abstract': False,
                'default_permissions': ('add', 'change', 'delete', 'view_only'),
            },
        ),
        migrations.CreateModel(
            name='UpgridBaseUser',
            fields=[
                ('username', models.CharField(max_length=150, null=True, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('data_joined', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='WhoopsReports',
            fields=[
                ('object_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('wr_created', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('wr_whoops_report', models.BinaryField(blank=True, null=True)),
                ('wr_token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('wr_program', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ceeb_program.Program')),
            ],
        ),
        migrations.CreateModel(
            name='UniversityCustomer',
            fields=[
                ('upgridbaseuser_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='upgrid.UpgridBaseUser')),
                ('department', models.CharField(blank=True, max_length=255, null=True)),
                ('main_user_id', models.CharField(blank=True, max_length=255, null=True)),
                ('service_level', models.CharField(choices=[('basic', 'Basic'), ('silver', 'Silver'), ('gold', 'Gold'), ('platinum', 'Platinum')], max_length=20, null=True)),
                ('title', models.CharField(choices=[('Master', 'Master.'), ('Dr', 'Dr'), ('Professor', 'Prof'), ('Mr', 'Mr.'), ('Miss', 'Miss.'), ('Ms', 'Ms.'), ('Mrs', 'Mrs.'), ('Mx', 'Mx.')], max_length=50, null=True)),
                ('contact_name', models.CharField(max_length=50, null=True)),
                ('position', models.CharField(max_length=50, null=True)),
                ('position_level', models.CharField(choices=[('University', 'University'), ('School', 'School'), ('Academic_Department', 'Academic_Department'), ('Administrative_Department', 'Administrative_Department'), ('Program', 'Program')], default='University', max_length=20, null=True)),
                ('phone', models.CharField(max_length=20, null=True)),
                ('account_type', models.CharField(choices=[('main', 'Main'), ('sub', 'Sub')], default='sub', max_length=20, null=True)),
                ('service_until', models.DateTimeField(null=True)),
                ('Ceeb', models.ForeignKey(db_constraint=False, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ceeb_program.UniversitySchool', to_field='ceeb')),
            ],
            options={
                'verbose_name': 'Client',
            },
            bases=('upgrid.upgridbaseuser',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UpgridAccountManager',
            fields=[
                ('upgridbaseuser_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='upgrid.UpgridBaseUser')),
                ('mobile', models.CharField(max_length=20, null=True)),
            ],
            options={
                'verbose_name': 'Account Manager',
            },
            bases=('upgrid.upgridbaseuser',),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='modified_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ceeb_program.Program'),
        ),
        migrations.AddField(
            model_name='customercompetingprogram',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='customercompetingprogram',
            name='customer_program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomerProgram'),
        ),
        migrations.AddField(
            model_name='customercompetingprogram',
            name='modified_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='customercompetingprogram',
            name='program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ceeb_program.Program'),
        ),
        migrations.AddField(
            model_name='clientandprogramrelation',
            name='client_program',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomerProgram'),
        ),
        migrations.AddField(
            model_name='clientandprogramrelation',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='clientandprogramrelation',
            name='modified_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='upgrid.UpgridBaseUser'),
        ),
        migrations.AddField(
            model_name='whoopsreports',
            name='wr_customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomer'),
        ),
        migrations.AddField(
            model_name='universitycustomerprogram',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomer'),
        ),
        migrations.AddField(
            model_name='universitycustomer',
            name='account_manager',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='upgrid.UpgridAccountManager'),
        ),
        migrations.AddField(
            model_name='universitycustomer',
            name='competing_schools',
            field=models.ManyToManyField(related_name='_universitycustomer_competing_schools_+', to='ceeb_program.UniversitySchool'),
        ),
        migrations.AlterUniqueTogether(
            name='enhancementreports',
            unique_together=set([('er_customer_program', 'er_created')]),
        ),
        migrations.AlterUniqueTogether(
            name='customercompetingprogram',
            unique_together=set([('customer_program', 'program')]),
        ),
        migrations.AddField(
            model_name='clientandprogramrelation',
            name='client',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='upgrid.UniversityCustomer'),
        ),
        migrations.AlterUniqueTogether(
            name='whoopsreports',
            unique_together=set([('wr_customer', 'wr_program', 'wr_created')]),
        ),
        migrations.AlterUniqueTogether(
            name='universitycustomerprogram',
            unique_together=set([('customer', 'program')]),
        ),
        migrations.AlterUniqueTogether(
            name='clientandprogramrelation',
            unique_together=set([('client', 'client_program')]),
        ),
    ]
