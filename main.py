from voice import acionar_gravacao_audio
from cp_scraper import get_next_train, get_train_hours
from tkinter import Tk, Button, Label, StringVar, ttk
import eel
import eel.browsers
import os

# MAIN
# Define caminho do navegador
edge_path = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
if os.path.exists(edge_path):
    eel.browsers.set_path('edge', edge_path)
else:
    print("⚠️ Microsoft Edge não encontrado no caminho especificado.")

# Iniciar Eel
eel.init('web')
eel.start(
    'main.html',
    mode='edge',
    size=(1500, 700),
    position='center'
)

# janela = Tk()
# janela.title("SIG - RPA")
# janela.geometry("1100x500")

# texto = StringVar()
# texto.set("fasfaffaecdcadsdxzcdsgs")

# botaoCP = Button(janela, text="Ver Horários dos Comboios", command=get_next_train)
# botaoCP.pack(pady=10)

# botaoVoz = Button(janela, text="Grave um Áudio", command=acionar_gravacao_audio)
# botaoVoz.pack(pady=10)

# janela.mainloop()