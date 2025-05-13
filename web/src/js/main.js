import { showToastWarning, showToastSuccess } from './utils.js';

let textoGravado = "";
let micOn = false;

window.onload = function () {
    const micBtn = document.getElementById("btnGravarAudio");
    const stopBtn = document.getElementById("btnPararAudio");

    fetch('src/shared/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;

        const btnMain = document.getElementById("btn-main");
        if (btnMain) {
            btnMain.classList.add("nav-link", "active");
        }
    })
    .catch(error => console.error('Erro ao carregar navbar:', error));

    micBtn.onclick = async function () {
        micOn = true;
        micBtn.classList.add("recording");
        showToastSuccess("A Captar Áudio ...");
        
        textoGravado = await eel.acionar_gravacao_audio()();
        micBtn.classList.remove("recording");

        if (micOn && textoGravado.trim() !== "") {
            document.getElementById("saida").innerText = textoGravado;
            document.getElementById("btnPesquisarGoogle").disabled = false;
            document.getElementById("btnAbrirCP").disabled = false;
        } else {
            showToastWarning("Não consegui entender o que tu disseste.");
        }
    };

    stopBtn.onclick = function () {
        micOn = false;
        showToastWarning("Gravação interrompida.");
        return;
    };

    document.getElementById("btnPesquisarGoogle").onclick = async function () {
        if (textoGravado.trim() !== "") {
            await eel.pesquisar_no_google(textoGravado)();
        } else {
            showToastWarning("Nenhum texto captado.");
        }
    };

    document.getElementById("btnAbrirCP").onclick = function () {
        if (textoGravado.trim() === "") {
            showToastWarning("Nenhum comando de voz detetado.");
            return;
        }
    
        const regex = /(?:quero ir|vou|pretendo ir|ir|sair|partir)?\s*(?:de)?\s*([a-zçãáéíóú ]+?)\s*(?:para|até|em direção a)\s*([a-zçãáéíóú ]+)/i;
        const match = textoGravado.match(regex);
    
        if (match) {
            const origem = match[1].trim();
            const destino = match[2].trim();
    
            sessionStorage.setItem("origem", origem);
            sessionStorage.setItem("destino", destino);
    
            window.location.href = "reservas.html";
        } else {
            showToastWarning("Não consegui interpretar a origem e o destino.");
        }
    };
};