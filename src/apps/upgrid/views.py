#Our lib
from ceeb_program.models import *

#lib in same project
from .models import *

from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.mail import EmailMessage


@receiver(post_save, sender=UniversityCustomer)
def send_user(sender, instance, created, **kwargs):
    if created:
        username = instance.username
        exp = instance.service_until
        email = instance.email
        html_content = ("Hello,%s !<br>I noticed you've signed up to Upgrid."
                        "I just wanted to say thanks and to let you know we're here to answer any questions."
                        "<br>We genuinely value user feedback. So please don't hesitate to get in contact with"
                        "us at gt267127@gmail.com, even if it's just to say Hi! Or you can just reply to this emal"
                        "and one of the team will get back to you.<br>-Upgrid Team")
        message = EmailMessage(subject='welcome', body=html_content %(username,),
            to=[email])
        message.content_subtype = 'html'
        message.send()


