import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/cubeai_erp")

# Ensure PostgreSQL database exists
try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "5432")),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "1234"),
        dbname="postgres",
        connect_timeout=3
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname='cubeai_erp'")
    if not cur.fetchone():
        cur.execute("CREATE DATABASE cubeai_erp")
        print("Database cubeai_erp created successfully.")
    else:
        print("Database cubeai_erp verified.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Database check notice: {e}")
