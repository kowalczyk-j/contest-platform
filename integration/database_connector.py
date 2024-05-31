import psycopg2
import time


def databaset_update_sleep(sleep_time=3):
    time.sleep(sleep_time)


class PostgreSQLConnection:
    def __init__(self, dbname, user, password, host):
        self.dbname = dbname
        self.user = user
        self.password = password
        self.host = host
        self.conn = None

    def __enter__(self):
        try:
            self.conn = psycopg2.connect(
                dbname=self.dbname,
                user=self.user,
                password=self.password,
                host=self.host
            )
            return self.conn
        except psycopg2.Error as e:
            print(f"Error connecting to PostgreSQL: {e}")

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            self.conn.close()


def get_entry_status(entry_title):
    try:
        with PostgreSQLConnection(
            dbname="contest_platform_database_test",
            user="admin",
            password="admin",
            host="127.0.0.1"
        ) as conn:
            with conn.cursor() as cursor:
                sql = "SELECT favourite, canceled FROM"
                sql += " contest_platform_entry WHERE entry_title = %s"
                cursor.execute(sql, (entry_title,))
                row = cursor.fetchone()
                if row:
                    favourite = row[0]
                    canceled = row[1]
                    return favourite, canceled
                else:
                    return None, None

    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")


def count_users_by_name(first_name, last_name):
    try:
        with PostgreSQLConnection(
            dbname="contest_platform_database_test",
            user="admin",
            password="admin",
            host="127.0.0.1"
        ) as conn:
            with conn.cursor() as cursor:
                sql = """
                SELECT COUNT(*)
                FROM public.contest_platform_user
                WHERE first_name = %s AND last_name = %s
                """
                cursor.execute(sql, (first_name, last_name))
                count = cursor.fetchone()[0]
                return count

    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None
