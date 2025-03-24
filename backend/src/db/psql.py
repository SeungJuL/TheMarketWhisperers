import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

PSQL_CONN = psycopg2.connect(
    database=os.getenv('PSQL_DB'), 
    host=os.getenv('PSQL_HOST'), 
    user=os.getenv('PSQL_USER'), 
    password=os.getenv('PSQL_PWD'), 
    port="5432"
    )

def conn_psql():
    global PSQL_CONN
    if PSQL_CONN.closed:
        PSQL_CONN = psycopg2.connect(
            database=os.getenv('PSQL_DB'), 
            host=os.getenv('PSQL_HOST'), 
            user=os.getenv('PSQL_USER'), 
            password=os.getenv('PSQL_PWD'), 
            port="5432"
        )
    return PSQL_CONN

