import sqlite3

class SQLiteHelper:
    def __init__(self, db_name):
        self.db_name = db_name
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_default_tables()

    def connect(self):
        self.conn = sqlite3.connect(self.db_name)
        self.cursor = self.conn.cursor()

    def create_table(self, table_name, fields):
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({fields})"
        self.cursor.execute(query)
        self.conn.commit()

    def create_default_tables(self):
        """Creates default tables: options and destinations."""
        self.create_table(
            "options",
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, enabled BOOLEAN NOT NULL"
        )
        self.create_table(
            "destinations",
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL"
        )

    # ---------- OPTIONS ----------
    def get_options(self):
        self.cursor.execute("SELECT id, name, enabled FROM options")
        return self.cursor.fetchall()

    def add_or_update_option(self, name, enabled):
        self.cursor.execute("SELECT id FROM options WHERE name = ?", (name,))
        result = self.cursor.fetchone()
        if result:
            self.cursor.execute("UPDATE options SET enabled = ? WHERE name = ?", (enabled, name))
        else:
            self.cursor.execute("INSERT INTO options (name, enabled) VALUES (?, ?)", (name, enabled))
        self.conn.commit()

    # ---------- DESTINATIONS ----------
    def get_destinations(self):
        self.cursor.execute("SELECT id, name FROM destinations")
        return self.cursor.fetchall()

    def add_destination(self, name):
        self.cursor.execute("INSERT INTO destinations (name) VALUES (?)", (name,))
        self.conn.commit()

    def update_destination(self, dest_id, new_name):
        self.cursor.execute("UPDATE destinations SET name = ? WHERE id = ?", (new_name, dest_id))
        self.conn.commit()

    def delete_destination(self, dest_id):
        self.cursor.execute("DELETE FROM destinations WHERE id = ?", (dest_id,))
        self.conn.commit()

    def close(self):
        if self.conn:
            self.conn.close()
