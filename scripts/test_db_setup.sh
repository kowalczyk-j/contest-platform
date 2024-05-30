#!/bin/bash

DB_NAME="contest_platform_database_test"
DB_USER="admin"
DB_PASSWORD="admin"
DB_HOST="localhost"
DB_PORT="5432"
SQL_FILE_PATH="scripts/test_data.sql"
ADMIN_DB="postgres"

export PGPASSWORD=$DB_PASSWORD

echo "Removing db $DB_NAME..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $ADMIN_DB -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Creating db $DB_NAME..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $ADMIN_DB -c "CREATE DATABASE $DB_NAME;"

echo "Loading data backup from $SQL_FILE_PATH"
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $SQL_FILE_PATH

unset PGPASSWORD

echo "Test db setup finished."
