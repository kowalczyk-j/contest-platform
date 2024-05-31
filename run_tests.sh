#!/bin/bash

# run in environment
sudo apt-get update
sudo apt-get -y install chromium-chromedriver

sudo service postgresql start &
cd backend
export DJANGO_ENV=test

python manage.py test

sudo ../scripts/test_db_setup.sh

python manage.py makemigrations
python manage.py migrate

python manage.py runserver &
PID_DJANGO=$!

sudo service rabbitmq-server start
python manage.py rundramatiq &

yacron -c yacron_jobs.yml &
PID_YACRON=$!

cd ../frontend
npm install
npm install --save @sentry/react
npm run dev &
PID_REACT=$!

cd ../backend


cd ..
pytest integration/ > integration-tests.log

cleanup() {
  sudo service postgresql stop
  kill $PID_DJANGO $PID_REACT
}

trap cleanup EXIT
wait
