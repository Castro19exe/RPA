const form = document.getElementById('reservaForm');
const resumo = document.getElementById('resumoReserva');
const resumoTexto = document.getElementById('resumoTexto');

window.onload = function () {

    
    const hoje = new Date();
    document.getElementById('data').value = hoje.toISOString().split('T')[0];
    const horas = String(hoje.getHours()).padStart(2, '0');
    const minutos = String(hoje.getMinutes()).padStart(2, '0');
    document.getElementById('hora').value = `${horas}:${minutos}`;
    
    document.getElementById('reservaForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita o recarregamento da página
    
        // Captura os valores do formulário
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const passageiros = document.getElementById('passageiros').value;
    
        // Combina data e hora em um formato que o Python possa processar
        const dataHoraStr = `${data}T${hora}`;
    
        try {
            // Chama a função Python para obter o próximo comboio
            const nextTrain = await eel.get_next_train(origem, destino, dataHoraStr)();
    
            if (nextTrain) {
                // Formata a resposta para exibição
                const options = { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                };
                const formattedDate = new Date(nextTrain).toLocaleDateString('pt-PT', options);
    
                // Exibe o resumo da reserva
                document.getElementById('resumoTexto').innerHTML = `
                    <strong>Origem:</strong> ${origem}<br>
                    <strong>Destino:</strong> ${destino}<br>
                    <strong>Próximo comboio disponível:</strong> ${formattedDate}<br>
                    <strong>Passageiros:</strong> ${passageiros}
                `;
                document.getElementById('resumoReserva').style.display = 'block';
            } else {
                alert("Não há comboios disponíveis para o horário selecionado.");
            }
        } catch (error) {
            console.error("Erro ao processar reserva:", error);
            alert("Ocorreu um erro ao processar a reserva.");
        }
    });

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