from voice import acionar_gravacao_audio
from cp_scraper import get_next_train, get_train_hours,get_all_stops
from tkinter import Tk, Button, Label, StringVar, ttk
import eel
import eel.browsers
import os
from sqllite_helper import SQLiteHelper as DB

@eel.expose
def cancelar_reserva(id_reserva):
    sql = f"UPDATE reservas SET canceled =1 where Id = {id_reserva}"
    db.custom_sql_query(sql)

@eel.expose
def get_train_hours_serialized(origem, destino):
    raw = get_train_hours(origem, destino)  
    return [h.isoformat() for h in raw]    

@eel.expose
def get_destinos_nome():
    return db.get_destinations_eel()

@eel.expose
def add_destination(name):
    db.add_destination(name)

@eel.expose
def update_all_destination():
    destinations = get_all_stops()
    db.custom_sql_query("DELETE FROM destinations")

    for destination in destinations:
        db.add_destination(destination)
# Define caminho do navegador
edge_path = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
if os.path.exists(edge_path):
    eel.browsers.set_path('edge', edge_path)
else:
    print("⚠️ Microsoft Edge não encontrado no caminho especificado.")

db = DB("database.db")

# Iniciar Eel
eel.init('web')
eel.start(
    'main.html',
    mode='edge',
    size=(1500, 900),
)