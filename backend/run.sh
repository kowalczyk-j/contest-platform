#!/bin/bash

# Odświeżanie ważności uprawnień sudo
sudo -v

# Instalowanie wymaganych pakietów
poetry install

# Uruchomienie PostgreSQL
sudo service postgresql start &
PID_POSTGRES=$!

# Ekportowanie zmiennej środowiskowej
export DJANGO_ENV=production
echo "Running on "$DJANGO_ENV" database"

# Migracje bazy danych
python manage.py makemigrations
python manage.py migrate

# Uruchomienie serwera backendowego Django w tle
python manage.py runserver &
PID_DJANGO=$!

# Uruchomienie RabbitMQ i dramatiq
sudo service rabbitmq-server start
python manage.py rundramatiq &

# Uruchomienie yacrona
yacron -c yacron_jobs.yml &
PID_YACRON=$!

# Uruchomienie serwera frontendowego React
cd ../frontend
npm install
npm install --save @sentry/react
npm run dev &
PID_REACT=$!

cd ..

# Zakończenie wszystkich procesów po zakończeniu pracy
trap "kill $PID_POSTGRES $PID_DJANGO $PID_REACT $PID_YACRON" EXIT

# Oczekiwanie na zakończenie skryptu
wait
