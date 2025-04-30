import speech_recognition as sr
import socket
import webbrowser
import urllib.parse
import eel

from tkinter import StringVar

def gravar_e_transcrever_audio():
    reconhecer = sr.Recognizer()

    try:
        socket.create_connection(("www.google.com", 80), timeout=5)
        print("Internet OK")
    except OSError:
        print("Sem internet!")
        return None

    with sr.Microphone() as source:
        print("Diga algo...")
        reconhecer.adjust_for_ambient_noise(source, duration=0.1)
        audio = reconhecer.listen(source)

        try:
            texto = reconhecer.recognize_google(audio, language="pt-BR")
            print("Tu disseste:", texto)
            return texto
        except sr.UnknownValueError:
            print("Não consegui entender o que você disse.")
        except sr.RequestError as e:
            print(f"Erro ao se comunicar com o serviço de reconhecimento: {e}")
        except Exception as e:
            print(f"Erro inesperado: {e}")

@eel.expose
def acionar_gravacao_audio():
    resultado = gravar_e_transcrever_audio()
    if resultado:
        comando = resultado.lower()

        if "google" in comando:
            webbrowser.open("https://www.google.com")
        elif "youtube" in comando:
            webbrowser.open("https://www.youtube.com")
        else:
            query = urllib.parse.quote(resultado)
            url = f"https://www.google.com/search?q={query}"
            webbrowser.open(url)

        # return f"Você disse: {resultado}"
        return resultado
    else:
        return "Nenhuma transcrição foi feita."