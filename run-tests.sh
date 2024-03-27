#!/bin/bash

# Odświeżanie ważności uprawnień sudo
sudo -v

# Uruchomienie PostgreSQL
sudo service postgresql start &
PID_POSTGRES=$!

cd frontend
npm install
npm run dev &
PID_REACT=$!

# TODO obgadać

cd ../backend
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
python manage.py runserver &
PID_DJANGO=$!

python manage.py test

cd ..

# Zakończenie wszystkich procesów po zakończeniu pracy
trap "kill $PID_POSTGRES $PID_DJANGO $PID_REACT" EXIT

# Oczekiwanie na zakończenie skryptu
wait
