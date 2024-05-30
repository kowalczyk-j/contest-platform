#!/bin/bash
set -e

poetry export -f requirements.txt --output requirements.txt --without-hashes
pip install -r requirements.txt

python manage.py rundramatiq

