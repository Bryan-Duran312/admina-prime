"""
WSGI config for admina_prime_core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admina_prime_core.settings')

application = get_wsgi_application()
app = application

if 'VERCEL' in os.environ and not os.path.exists('/tmp/db.sqlite3'):
	from django.core.management import call_command

	call_command('migrate', interactive=False, verbosity=0)
