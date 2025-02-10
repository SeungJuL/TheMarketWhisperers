import psycopg2
import os

PSQL_CONN = psycopg2.connect(
    database=os.getenv('PSQL_DB_NAME'), 
    host="localhost", 
    user="postgres", 
    password=os.getenv('PSQL_PWD'), 
    port="5432"
    )

def conn_psql():
    global PSQL_CONN
    if PSQL_CONN.closed:
        PSQL_CONN = psycopg2.connect(
        database=os.getenv('PSQL_DB_NAME'), 
        host="localhost", 
        user="postgres", 
        password=os.getenv('PSQL_PWD'), 
        port="5432"
        )
    return PSQL_CONN

