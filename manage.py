#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # remove default Python path
    start_path = os.path.dirname(os.path.abspath(__file__))
    sys.path.remove(start_path)

    # add "./src" directory to Python load path, since it's the root of deployed app
    root_path = os.path.join(start_path, 'src')
    sys.path.append(root_path)

    #
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.dev_settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
