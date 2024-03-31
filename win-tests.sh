#!/bin/bash

pg_ctl start
PID_POSTGRES=$!

cd backend
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate

pipenv run python manage.py runserver &
PID_DJANGO=$!

cd ../frontend
npm install
npm run dev &
PID_REACT=$!

cd ../backend
pipenv run python manage.py test
cd ..
pipenv run pytest integration/

cleanup() {
  kill $PID_POSTGRES $PID_DJANGO $PID_REACT
}

trap cleanup EXIT

wait
