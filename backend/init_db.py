import os
from dotenv import load_dotenv
from database import engine
import models

load_dotenv()

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    
    # Parse or default
    conn = psycopg2.connect(
        host='127.0.0.1',
        port=5432,
        user='postgres',
        password='1234',
        dbname='postgres',
        connect_timeout=3
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname='cubeai_erp'")
    if not cur.fetchone():
        cur.execute("CREATE DATABASE cubeai_erp")
        print("Database cubeai_erp created successfully.", flush=True)
    else:
        print("Database cubeai_erp verified.", flush=True)
    cur.close()
    conn.close()
except Exception as e:
    print(f"PostgreSQL connection check: {e}. Proceeding with SQLAlchemy engine.", flush=True)

models.Base.metadata.create_all(bind=engine)
print("Database tables initialized successfully on engine:", engine.url, flush=True)
