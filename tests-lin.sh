#!/bin/bash

sudo service postgresql start
cd backend
pipenv run python3 manage.py makemigrations
pipenv run python3 manage.py migrate
pipenv run python3 manage.py runserver &
PID_DJANGO=$!

cd ../frontend
npm install
npm run dev &
PID_REACT=$!

cd ../backend
pipenv run python3 manage.py test

cd ..
pipenv run pytest integration/

cleanup() {
  sudo service postgresql stop
  kill $PID_DJANGO $PID_REACT
}

trap cleanup EXIT
wait
