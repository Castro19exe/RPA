from voice import acionar_gravacao_audio
from cp_scraper import get_next_train, get_train_hours
#from datetime import datetime
from tkinter import Tk, Button, Label, StringVar, ttk

# MAIN
janela = Tk()
janela.title("SIG - RPA")
janela.geometry("1100x500")

texto = StringVar()
texto.set("fasfaffaecdcadsdxzcdsgs")

#botaoCP = Button(janela, text='press', command= lambda: action(["Santarem", "Alverca", datetime.now()]))

botaoCP = Button(janela, text="Ver Horários dos Comboios", command=get_next_train)
botaoCP.pack(pady=10)

botaoVoz = Button(janela, text="Grave um Áudio", command=acionar_gravacao_audio)
botaoVoz.pack(pady=10)

janela.mainloop()