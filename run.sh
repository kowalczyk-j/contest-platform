#!/bin/bash

# Odświeżanie ważności uprawnień sudo
sudo -v

# Uruchomienie PostgreSQL
sudo service postgresql start &
PID_POSTGRES=$!

# Migracje bazy danych
cd backend
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate

# Uruchomienie serwera backendowego Django w tle
python manage.py runserver &
PID_DJANGO=$!

# Uruchomienie serwera frontendowego React
cd ../frontend
npm install
npm run dev &
PID_REACT=$!

cd ..

# Zakończenie wszystkich procesów po zakończeniu pracy
trap "kill $PID_POSTGRES $PID_DJANGO $PID_REACT" EXIT

# Oczekiwanie na zakończenie skryptu
wait
