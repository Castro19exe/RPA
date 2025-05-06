import speech_recognition as sr
import socket
import re
import webbrowser
import urllib.parse
import eel

def gravar_e_transcrever_audio():
    reconhecer = sr.Recognizer()

    try:
        socket.create_connection(("www.google.com", 80), timeout=5)
        print("Internet OK")
    except OSError:
        print("Sem internet!")
        return "Sem conexão com a internet."

    with sr.Microphone() as source:
        print("Diga algo...")
        reconhecer.adjust_for_ambient_noise(source, duration=0.1)
        audio = reconhecer.listen(source)

        try:
            texto = reconhecer.recognize_google(audio, language="pt-BR")
            return texto
        except sr.UnknownValueError:
            print("Não consegui entender o que tu disseste.")
        except sr.RequestError as e:
            print(f"Erro ao se comunicar com o serviço de reconhecimento: {e}")
        except Exception as e:
            print(f"Erro inesperado: {e}")

@eel.expose
def acionar_gravacao_audio():
    resultado = gravar_e_transcrever_audio()

    if resultado is not None:
        comando = resultado.lower()
    else:
        print("Não foi possível entender o áudio.")
        comando = ""

    if "google" in comando:
        webbrowser.open("https://www.google.com")
    elif "youtube" in comando:
        webbrowser.open("https://www.youtube.com")
    else:
        print(f"Tu disseste: {resultado}")
        
    return resultado

@eel.expose
def pesquisar_no_google(resultado):
    if resultado:
        query = urllib.parse.quote(resultado)
        url = f"https://www.google.com/search?q={query}"
        webbrowser.open(url)

        return resultado
    else:
        return "Não consegui entender o que tu disseste."
    
@eel.expose
def reconhecer_origem():
    resultado = gravar_e_transcrever_audio()
    if not resultado:
        print("Não disseste nada.")
        
    return resultado

@eel.expose
def reconhecer_destino():
    resultado = gravar_e_transcrever_audio()
    if not resultado:
        print("Não disseste nada.")
        
    return resultado
