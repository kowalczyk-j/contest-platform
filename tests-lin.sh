#!/bin/bash

sudo apt-get update
sudo apt-get -y install chromium-chromedriver

sudo service postgresql start
cd backend
poetry install
poetry shell

python manage.py makemigrations
python manage.py migrate
python manage.py runserver &
PID_DJANGO=$!

cd ../frontend
npm install
npm run dev &
PID_REACT=$!

cd ../backend
python manage.py test

cd ..
pytest integration/

cleanup() {
  sudo service postgresql stop
  kill $PID_DJANGO $PID_REACT
}

trap cleanup EXIT
wait
