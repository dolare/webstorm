import uuid

from django.db import models
from django.contrib.auth.models import Group
from django.contrib.auth.models import User

from ceeb_program.models import AbstractDatedObject, Program

GROUP_KNOWLEDGE_EXPERTS = "knowledge experts"
GROUP_PROOF_EXPERTS = "proof experts"
GROUP_KE_VENDORS = "KE vendors"


class ProgramAssignment(AbstractDatedObject):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.OneToOneField(Program, blank=True, null=True)
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='+', null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True,
                              choices=(
                                  ("Assigned", "Assigned"),
                                  ("InProgress", "In progress"),
                                  ("NeedUpdate", "Need update"),
                                  ("Done", "Done"),
                              ),
                              default='Assigned',
                              verbose_name='Assignment status')


class ProgramProof(AbstractDatedObject):
    object_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.OneToOneField(Program, blank=True, null=True)
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='+', null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True,
                              choices=(
                                  ("None", "None"),
                                  ("Assigned", "Assigned"),
                                  ("InProgress", "In progress"),
                                  ("Done", "Done"),
                              ),
                              default='None',
                              verbose_name='Review status')
    notes = models.TextField(blank=True, null=True)


def users_of_group(group_name):
    group = Group.objects.get(name=group_name)
    users = group.user_set.all()
    return users
