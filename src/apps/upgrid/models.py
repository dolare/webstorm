# System lib
from django.db import models
from django.utils.deprecation import CallableTrue
from django.contrib.auth.models import UserManager
import uuid
from django.utils import timezone
from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.postgres.fields import JSONField
# 3rd party lib
# our lib
from ceeb_program.models import Program, UniversitySchool
from datetime import datetime   # used for shared link models

# Create your models here.


#---------------------------based models-------------------------------
class BasedDatedObject(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
  
    class Meta:
        abstract = True
        default_permissions = ('add', 'change', 'delete', 'view_only')


class BasedSimpleObject(BasedDatedObject):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=40, null=False, unique=True)
    description = models.TextField(null=True, blank=True)

    class Meta(BasedDatedObject.Meta):
        abstract = True
        ordering = [
            'name'
        ]

    def __str__(self):
        return "{0}".format(self.name)



# ------------------------Custom Base User-----------------------------------------


class UpgridBaseUserManager(models.Manager):
    def _create_user(self, username, email, password, **extra_fields):
        """
        Creates and save a User with the given username, email and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        email = self.email
        username = self.username
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault(self.is_active, False)
        return self._create_user(username, email, password, **extra_fields)

    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})
        

class UpgridBaseUser(models.Model):
    username = models.CharField(max_length=150, null=True, unique=True, blank=False)
    password = models.CharField(max_length=128)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=254, unique=True, null=True, blank=False)
    is_active = models.BooleanField(default=False)
    data_joined = models.DateTimeField(default=timezone.now)
    # last_login = models.DateTimeField(default=timezone.now, blank=True, null=True)

    objects = UpgridBaseUserManager()

    # class Meta:
    #     abstract = True
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'

    def __init__(self, *args, **kwargs):
        super(UpgridBaseUser, self).__init__(*args, **kwargs)
        # store the raw password if set_password() is called so that it can be passed to
        # password_changed() after the model is saved.
        self._password = None

    def save(self, *args, **kwargs):
        print(self.password)
        if self._password == None:
            print('_password == none')
            self.set_password(self.password)
            print(self.password)
        super(UpgridBaseUser, self).save(*args, **kwargs)
        # if self._password is not None:
        #     password_validation.password_changed(self._password, self)
        #     self._password = None

        #     #self.password = make_password(self.password)
        #      super(UpgridBaseUser, self).save(*args, **kwargs)
        # if self._password is not None:
        #     password_validation.password_changed(self._password, self)
        #     self._password = None
        # else:
        #     self.password = make_password(self.password)
        #     print(self.password)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self._password = raw_password

    def check_password(self, raw_password):
        """
        Return a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """

        def setter(raw_password):
            self.set_password(raw_password)
            # Password hash upgrades shouldn't be considered password changes.
            self._password = None
            self.save(update_fields=["password"])

        return check_password(raw_password, self.password, setter)

    def __str__(self):
        return '{0} - {1}'.format(self.username, self.email)

    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been authenticated in templates.
        """
        return CallableTrue

    def get_username(self):
        return self.username

    def natural_key(self):
        return self.get_username()

# ---------------------------------------------------------------------------------


class UpgridAccountManager(UpgridBaseUser):

    mobile = models.CharField(max_length=20, null=True)
    modify_user = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Account Manager'


class UniversityCustomer(UpgridBaseUser):

    title = (('Master', 'Master.'), ('Dr', 'Dr'), ('Professor', 'Prof'), ('Mr', 'Mr.'), ('Miss', 'Miss.'),
             ('Ms', 'Ms.'), ('Mrs', 'Mrs.'), ('Mx', 'Mx.'))

    positionlevel = (('university', 'University'), ('School', 'School'),
                     ('acd_dep', 'Academic_Department'),
                     ('admin_dep', 'Administrative_Department'),
                     ('program', 'Program'),)
    servicelevel = (('basic', 'Basic'), ('silver', 'Silver'), ('gold', 'Gold'),
                    ('platinum', 'Platinum'))
    accounttype = (('main', 'Main'), ('sub', 'Sub'))

    objects = UserManager()
    is_demo = models.BooleanField(default=False)
    can_ccemail = models.BooleanField(default=False)
    Ceeb = models.ForeignKey(UniversitySchool, to_field='ceeb', on_delete=models.SET_NULL,
                             db_constraint=False, null=True)
    department = models.CharField(max_length=255, null=True, blank=True)
    account_manager = models.ForeignKey(UpgridAccountManager, on_delete=models.PROTECT, null=True)
    # for sub user to store main user information
    main_user_id = models.CharField(max_length=255, null=True, blank=True)
    service_level = models.CharField(max_length=20, choices=servicelevel, null=True)
    title = models.CharField(max_length=50, choices=title, null=True, blank=False)
    contact_name = models.CharField(max_length=50, null=True)
    position = models.CharField(max_length=50, null=True)
    position_level = models.CharField(max_length=50, choices=positionlevel, default='University', null=True)
    phone = models.CharField(max_length=20, null=True)
    account_type = models.CharField(max_length=20, choices=accounttype, default='sub', null=True)
    service_until = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)
    competing_schools = models.ManyToManyField(UniversitySchool, related_name='+', blank=True)
    non_degree_schools = models.ManyToManyField(UniversitySchool, blank=True, related_name='non_degree_user')

    def __str__(self):
        return '{0} - {1}'.format(self.Ceeb, self.username)

    class Meta:
        verbose_name = "Client"


class UpgridAbstractDatedObject(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(UpgridBaseUser, on_delete=models.SET_NULL, related_name='+', null=True, blank=True)
    modified_by = models.ForeignKey(UpgridBaseUser, on_delete=models.SET_NULL, related_name='+', null=True, blank=True)

    class Meta:
        abstract = True
        default_permissions = ('add', 'change', 'delete', 'view_only')   


# Used for set up main user's program relation
class UniversityCustomerProgram(UpgridAbstractDatedObject):

    Status = (('in_progress', 'In_Progress'), ('done', 'Done'))

    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT)
    program = models.ForeignKey(Program, on_delete=models.PROTECT)
    whoops_status = models.CharField(max_length=50, choices=Status, default='in_progress')
    whoops_final_release = models.CharField(max_length=20, choices=(('True', 'Released'),
                                                                    ('False', 'Unreleased')), default='False')
    enhancement_final_release = models.CharField(max_length=20, choices=(('True', 'Released'),
                                                                         ('False', 'Unreleased')), default='False')
    customer_confirmation = models.CharField(max_length=20,
                                             choices=(('Yes', 'Confirmed'), ('No', 'Not Confirmed')), default='No')
    whoops_final_release_time = models.DateTimeField(null=True)
    enhancement_final_release_time = models.DateTimeField(null=True)

    whoops = models.BooleanField(default=True)
    enhancement = models.BooleanField(default=True)
    none_degree = models.BooleanField(default=True)

    class Meta(UpgridAbstractDatedObject.Meta):
        unique_together = ('customer', 'program')

    def __str__(self):
        return '{0}'.format(self.program)


# Used for set up main user's competing program relation
class CustomerCompetingProgram(UpgridAbstractDatedObject):
    Status = (('in_progress', 'In_Progress'), ('done', 'Done'))

    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    program = models.ForeignKey(Program, on_delete=models.PROTECT)
    order = models.IntegerField(null=True, blank=True)
    enhancement_status = models.CharField(max_length=50, choices=Status, default='in_progress')

    class Meta(UpgridAbstractDatedObject.Meta):
        unique_together = ('customer_program', 'program')

    def __str__(self):
        return '{0}'.format(self.program)


# Used for set up sub user's program relation
class ClientAndProgramRelation(UpgridAbstractDatedObject):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT, null=True)
    client_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT, null=True)

    class Meta(UpgridAbstractDatedObject.Meta):
        unique_together = ('client', 'client_program')

    def __str__(self):
        return '{0} - {1}'.format(self.client, self.client_program)

'''
model for whoops report, almost same to UniversityCustomerProgram
'''


class WhoopsReports(models.Model):
    """This is the whooop reports model. it could store up to 5 history of whoops reports."""
    @staticmethod
    def delete_history():
        num = WhoopsReports.objects.count()
        if num != None and num >= 9:
            to_be_delete = WhoopsReports.objects.order_by('wr_created')[:5]
            for item in to_be_delete:
                item.delete()
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wr_created = models.DateTimeField(default=datetime.now, blank=True)
    wr_customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT) 
    wr_program = models.ForeignKey(Program, on_delete=models.PROTECT)
    wr_whoops_report = models.BinaryField(blank=True, null=True)
    wr_token = models.UUIDField(primary_key=False,  unique=True, default=uuid.uuid4, editable=False)

    class Meta:
        unique_together = (('wr_customer', 'wr_program', 'wr_created'),)

    def __str__(self):
        return '{0} - {1}'.format(self.wr_customer, self.wr_program, self.wr_created)
        
    def save(self, *args, **kwargs):
        self.__class__.delete_history()  # call the static method before saving
        super(WhoopsReports, self).save(*args, **kwargs)
'''
model for enhancement report
'''


class EnhancementReports(models.Model):
    """This is the enhancement reports model. it could store up to 5 history of whoops reports."""
    @staticmethod
    def delete_history():
        num = EnhancementReports.objects.count()
        if num != None and num >= 5:
            to_be_delete = EnhancementReports.objects.order_by('er_created')[:num-4]
            for item in to_be_delete:
                item.delete()
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    er_created = models.DateTimeField(default=datetime.now, blank=True) 
    er_customer_program = models.ForeignKey(Program, on_delete=models.PROTECT)
    er_enhancement_report = models.BinaryField(blank=True, null=True)
    er_token = models.UUIDField(primary_key=False, unique=True, default=uuid.uuid4, editable=False)
    
    class Meta:
        unique_together = (('er_customer_program', 'er_created',),)

    def __str__(self):
        return '{0}-{1}'.format(self.er_customer_program, self.er_created)

    def save(self, *args, **kwargs):
        self.__class__.delete_history()  # call the static method inside method
        super(EnhancementReports, self).save(*args, **kwargs)


def one_day_hence():
    return timezone.now() + timezone.timedelta(days=1)


class SharedReportsRelation(models.Model):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(UpgridBaseUser, on_delete=models.PROTECT)
    created_time = models.DateTimeField(default=datetime.now, blank=True)
    expired_time = models.DateTimeField(default=one_day_hence, blank=True)
    access_token = models.UUIDField(primary_key=False, unique=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return '{0} - {1}'.format(self.created_by, self.created_time)


class WhoopsReportsRepo(models.Model):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wr_created = models.DateTimeField(default=datetime.now, blank=True)
    wr_customer_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    wr_whoops_report = models.BinaryField(blank=True, null=True)
    wr_share_relation = models.ForeignKey(SharedReportsRelation, on_delete=models.PROTECT, blank=True, null=True)

    def __str__(self):
        return '{0}-{1}'.format(self.wr_created, self.wr_customer_program)


class EnhancementReportsRepo(models.Model):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    er_created = models.DateTimeField(default=datetime.now, blank=True)
    er_customer_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    er_enhancement_report = models.BinaryField(blank=True, null=True)
    er_share_relation = models.ForeignKey(SharedReportsRelation, on_delete=models.PROTECT, blank=True, null=True)

    def __str__(self):
        return '{0}-{1}'.format(self.er_created, self.er_customer_program)


class EnhancementUpdate(models.Model):
    """This is the enhancement reports update model."""
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT)
    created = models.DateTimeField(default=datetime.now, blank=True)
    customer_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    existing_report = models.BinaryField(blank=True, null=True)
    cache_report = models.BinaryField(blank=True, null=True)
    initial_diff = models.BinaryField(blank=True, null=True)
    prev_diff = models.BinaryField(blank=True, null=True)
    confirmed_diff = models.BinaryField(blank=True, null=True)
    update_diff = models.BinaryField(blank=True, null=True)
    most_recent = models.BooleanField(default=False)
    last_edit_time = models.DateTimeField(null=True)

    class Meta:
        unique_together = ('customer', 'customer_program', 'created',)

    def __str__(self):
        return '{0}-{1}'.format(self.customer_program, self.created)

    def save(self, *args, **kwargs):
        super(EnhancementUpdate, self).save(*args, **kwargs)


class WhoopsUpdate(models.Model):
    """This is the whoops reports update model. """
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT)
    created = models.DateTimeField(default=datetime.now, blank=True)
    customer_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    existing_report = models.BinaryField(blank=True, null=True)
    cache_report = models.BinaryField(blank=True, null=True)
    initial_diff = models.BinaryField(blank=True, null=True)
    prev_diff = models.BinaryField(blank=True, null=True)
    confirmed_diff = models.BinaryField(blank=True, null=True)
    update_diff = models.BinaryField(blank=True, null=True)
    most_recent = models.BooleanField(default=False)
    last_edit_time = models.DateTimeField(null=True)

    class Meta:
        unique_together = ('customer', 'customer_program', 'created',)

    def __str__(self):
        return '{0}-{1}'.format(self.customer_program, self.created)

    def save(self, *args, **kwargs):
        super(WhoopsUpdate, self).save(*args, **kwargs)


class ConfirmedUpdateEmailQueue(models.Model):
    """
        Send update programs emails for customer.
    """
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT)
    confirmed_program = models.ForeignKey(UniversityCustomerProgram, on_delete=models.PROTECT)
    update_report_type = models.CharField(max_length=20, choices=(('whoops', 'Whoops'),
                                                                  ('enhancement', 'Enhancement')),
                                          null=True, blank=True)


class CustomerFeature(BasedSimpleObject):
    """
    Feature reference table
    """
    pass


class CustomerFeatureMapping(BasedDatedObject):
    """
    customer feature mapping table
    """
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(UniversityCustomer, on_delete=models.PROTECT, null=True, blank=True)
    feature = models.ForeignKey(CustomerFeature, on_delete=models.PROTECT, null=True, blank=True)


class NonDegreeReleaseReport(BasedDatedObject):
    """
    non-degree school release report
    """
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(UniversitySchool, on_delete=models.CASCADE, null=False)
    categories = JSONField()
