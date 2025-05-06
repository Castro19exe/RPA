from voice import acionar_gravacao_audio
from cp_scraper import get_next_train, get_train_hours
from tkinter import Tk, Button, Label, StringVar, ttk
import eel
import eel.browsers
import os
from sqllite_helper import SQLiteHelper as DB

@eel.expose
def get_destinos_nome():
    return ["Lisboa", "Vila Franca"]


# MAIN
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
