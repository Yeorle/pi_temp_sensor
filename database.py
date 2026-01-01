import sqlite3
import datetime

DB_NAME = "sensor_data.db"

def init_db():
    """Initializes the database with the readings table."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS readings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    temperature REAL,
                    humidity REAL
                )''')
    conn.commit()
    conn.close()

def log_data(temperature, humidity):
    """Logs a new reading to the database."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO readings (temperature, humidity) VALUES (?, ?)", (temperature, humidity))
    conn.commit()
    conn.close()

def get_data(hours=24): 
    """Retrieves readings from the last N hours."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Calculate cutoff time
    cutoff = datetime.datetime.now() - datetime.timedelta(hours=hours)
    
    c.execute("SELECT * FROM readings WHERE timestamp > ? ORDER BY timestamp DESC", (cutoff,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
