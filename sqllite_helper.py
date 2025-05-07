import sqlite3
import eel

class SQLiteHelper:
    def __init__(self, db_name):
        self.db_name = db_name
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_default_tables()
        self.expose_to_eel()

    def connect(self):
        self.conn = sqlite3.connect(self.db_name)
        self.cursor = self.conn.cursor()

    def expose_to_eel(self):
        """Expõe os métodos necessários para o Eel"""
        eel.expose(self.get_destinations_eel)
        eel.expose(self.delete_destination_eel)
        eel.expose(self.adicionar_reserva)

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
        self.create_table(
            "reservas",
            "id INTEGER PRIMARY KEY AUTOINCREMENT, origem TEXT NOT NULL, destino TEXT NOT NULL, data TEXT NOT NULL"
        )


    # ---------- DESTINATIONS ----------
    def get_destinations(self):
        self.cursor.execute("SELECT id, name FROM destinations ORDER BY name")
        return self.cursor.fetchall()

    def get_destinations_eel(self):
        """Versão do método para ser chamada via Eel"""
        return [name for _, name in self.get_destinations()]

    def add_destination(self, name):
        self.cursor.execute("INSERT INTO destinations (name) VALUES (?)", (name,))
        self.conn.commit()

    def update_destination(self, dest_id, new_name):
        self.cursor.execute("UPDATE destinations SET name = ? WHERE id = ?", (new_name, dest_id))
        self.conn.commit()

    def delete_destination(self, dest_id):
        self.cursor.execute("DELETE FROM destinations WHERE id = ?", (dest_id,))
        self.conn.commit()

    def delete_destination_eel(self, dest_id):
        """Versão do método para ser chamada via Eel"""
        self.delete_destination(dest_id)


    # ---------- Reservas ----------

    def adicionar_reserva(self, origem, destino, data):
        self.cursor.execute("INSERT INTO reservas (origem, destino, data) VALUES (?, ?, ?)", (origem, destino, data))
        self.conn.commit()



    def close(self):
        if self.conn:
            self.conn.close()