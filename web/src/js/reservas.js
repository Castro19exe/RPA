const form = document.getElementById('reservaForm');
const resumo = document.getElementById('resumoReserva');
const resumoTexto = document.getElementById('resumoTexto');

async function carregarDestinos() {
    try {
        // Chamar a função Python via Eel
        const destinos = await eel.get_destinos_nome()();
        
        // Obter os elementos select
        const selectDestino = document.getElementById('destino');
        const selectOrigem = document.getElementById('origem');
        
        // Limpar opções existentes (exceto a primeira opção padrão)
        while (selectDestino.options.length > 1) {
            selectDestino.remove(1);
        }
        while (selectOrigem.options.length > 1) {
            selectOrigem.remove(1);
        }
        
        // Adicionar os novos destinos
        destinos.forEach(destino => {
            // Adicionar ao destino
            const optionDestino = document.createElement('option');
            optionDestino.value = destino;
            optionDestino.textContent = destino;
            selectDestino.appendChild(optionDestino);
            
            // Adicionar à origem (usar clone para evitar referência ao mesmo objeto)
            const optionOrigem = optionDestino.cloneNode(true);
            selectOrigem.appendChild(optionOrigem);
        });
    } catch (error) {
        console.error('Erro ao carregar destinos:', error);
    }
}

// Função para selecionar a opção correta no combobox
function selecionarValorNoSelect(id, valor) {
    const select = document.getElementById(id);
    for (const option of select.options) {
        if (option.value.toLowerCase() === valor.toLowerCase()) {
            select.value = option.value;
            return true;
        }
    }
    alert(`Estação "${valor}" não encontrada.`);
    return false;
}

window.onload = function() {
    carregarDestinos();

    // Configurar data e hora atuais
    const hoje = new Date();
    document.getElementById('data').value = hoje.toISOString().split('T')[0];
    const horas = String(hoje.getHours()).padStart(2, '0');
    const minutos = String(hoje.getMinutes()).padStart(2, '0');
    document.getElementById('hora').value = `${horas}:${minutos}`;
    
    // Configurar botões de voz
    document.getElementById("btnGravarOrigem").onclick = async function() {
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const resultado = await eel.reconhecer_origem()();
            selecionarValorNoSelect("origem", resultado);
        } catch (error) {
            console.error("Erro ao reconhecer origem:", error);
            alert("Erro ao reconhecer a origem por voz.");
        }
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.disabled = false;
    };

    document.getElementById("btnGravarDestino").onclick = async function() {
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const resultado = await eel.reconhecer_destino()();
            selecionarValorNoSelect("destino", resultado);
        } catch (error) {
            console.error("Erro ao reconhecer destino:", error);
            alert("Erro ao reconhecer o destino por voz.");
        }
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.disabled = false;
    };

    // Configurar submit do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const passageiros = document.getElementById('passageiros').value;
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
                resumoTexto.innerHTML = `
                    <strong>Origem:</strong> ${origem}<br>
                    <strong>Destino:</strong> ${destino}<br>
                    <strong>Próximo comboio disponível:</strong> ${formattedDate}<br>
                    <strong>Passageiros:</strong> ${passageiros}
                `;
                resumo.style.display = 'block';
            } else {
                alert("Não há comboios disponíveis para o horário selecionado.");
            }
        } catch (error) {
            console.error("Erro ao processar reserva:", error);
            alert("Ocorreu um erro ao processar a reserva.");
        }
    });
};