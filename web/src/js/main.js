let textoGravado = "";
let micOn = false;

window.onload = function () {
    // // Dark mode toggle
    // document.getElementById("toggleDarkMode").addEventListener("change", function () {
    //     document.body.classList.toggle("dark-mode");
    // });

    const micBtn = document.getElementById("btnGravarAudio");
    const stopBtn = document.getElementById("btnPararAudio");

    micBtn.onclick = async function () {
        micOn = true;
        micBtn.classList.add("recording");
        
        textoGravado = await eel.acionar_gravacao_audio()();
        micBtn.classList.remove("recording");

        if (micOn && textoGravado.trim() !== "") {
            document.getElementById("saida").innerText = textoGravado;
        } else {
            showToast("Não consegui entender o que tu disseste.");
        }
    };

    stopBtn.onclick = function () {
        micOn = false;
        showToast("Gravação interrompida.");
    };

    document.getElementById("btnPesquisarGoogle").onclick = async function () {
        if (textoGravado.trim() !== "") {
            await eel.pesquisar_no_google(textoGravado)();
        } else {
            showToast("Nenhum texto captado.");
        }
    };
};

function showToast(message) {
    document.getElementById("toastMessage").innerText = message;
    const toast = new bootstrap.Toast(document.getElementById("customToast"));
    toast.show();
}