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
        eel.expose(self.get_reservas_eel)
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
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, status BOOLEAN NOT NULL DEFAULT 1"
        )
        self.create_table(
            "reservas",
            "id INTEGER PRIMARY KEY AUTOINCREMENT, origem TEXT NOT NULL, destino TEXT NOT NULL, data TEXT NOT NULL,passageiros INT NOT NULL, canceled BOOLEAN NOT NULL"
        )

    def custom_sql_query(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    # ---------- DESTINATIONS ----------
    def get_all_destinations(self):
        self.cursor.execute("SELECT id, name, status FROM destinations ORDER BY id")
        return self.cursor.fetchall()

    def get_all_destinations_eel(self):
        """Versão do método para ser chamada via Eel"""
        return [{'id': row[0], 'name': row[1], 'status': row[2]} for row in self.get_all_destinations()]

    def get_destinations(self):
        self.cursor.execute("SELECT id, name, status FROM destinations WHERE status = 1 ORDER BY id")
        return self.cursor.fetchall()

    def get_destinations_eel(self):
        """Versão do método para ser chamada via Eel"""
        return [{'id': row[0], 'name': row[1], 'status': row[2]} for row in self.get_destinations()]

    def add_destination(self, name):
        self.cursor.execute("INSERT INTO destinations (name) VALUES (?)", (name,))
        self.conn.commit()

    def update_status_destination(self, dest_id):
        self.cursor.execute("SELECT status FROM destinations WHERE id = ?", (dest_id,))
        result = self.cursor.fetchone()

        if result is None:
            return False  # destino não encontrado

        current_status = result[0]
        new_status = 0 if current_status == 1 else 1

        self.cursor.execute("UPDATE destinations SET status = ? WHERE id = ?", (new_status, dest_id))
        self.conn.commit()

        return new_status

    def delete_destination(self, dest_id):
        self.cursor.execute("DELETE FROM destinations WHERE id = ?", (dest_id,))
        self.conn.commit()

    def delete_destination_eel(self, dest_id):
        """Versão do método para ser chamada via Eel"""
        self.delete_destination(dest_id)


    # ---------- Reservas ----------
    def get_reservas(self):
        self.cursor.execute("SELECT id, origem, destino, data ,passageiros,canceled FROM reservas ORDER BY id")
        return self.cursor.fetchall()

    def get_reservas_eel(self):
        """Versão do método para ser chamada via Eel"""
        return [{'id': row[0], 'origem': row[1], 'destino': row[2], 'data': row[3],'passageiros':row[4], 'canceled': row[5]} for row in self.get_reservas()]

    def adicionar_reserva(self, origem, destino, data,passageiros):
        self.cursor.execute("INSERT INTO reservas (origem, destino, data,passageiros ,canceled) VALUES (?, ?, ?, ?,?)", (origem, destino, data,passageiros,0))
        self.conn.commit()

    

    def close(self):
        if self.conn:
            self.conn.close()