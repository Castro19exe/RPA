const form = document.getElementById('reservaForm');
const resumo = document.getElementById('resumoReserva');
const resumoTexto = document.getElementById('resumoTexto');

window.onload = function () {
    document.getElementById("btnGravarOrigem").onclick = async function () {
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const resultado = await eel.reconhecer_origem()(); // backend devolve ex: "Lisboa"
        selecionarValorNoSelect("origem", resultado);
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.disabled = false;
    };

    document.getElementById("btnGravarDestino").onclick = async function () {
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const resultado = await eel.reconhecer_destino()(); // backend devolve ex: "Porto"
        selecionarValorNoSelect("destino", resultado);
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.disabled = false;
    };

    // Função para selecionar a opção correta no combobox
    function selecionarValorNoSelect(id, valor) {
        const select = document.getElementById(id);
        for (const option of select.options) {
            if (option.value.toLowerCase() === valor.toLowerCase()) {
                select.value = option.value;
                return;
            }
        }
        alert(`Estação "${valor}" não encontrada.`);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const passageiros = document.getElementById('passageiros').value;

        resumoTexto.textContent = `Reserva de ${passageiros} passageiro(s) de ${origem} para ${destino} no dia ${data}.`;
        resumo.style.display = 'block';
    });
};