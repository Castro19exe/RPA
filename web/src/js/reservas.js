import { showSpinner, hideSpinner } from './utils.js';

// document.addEventListener('DOMContentLoaded', function () {
//     fetch('src/shared/navbar.html')
//     .then(response => response.text())
//     .then(data => {
//         document.getElementById('navbar').innerHTML = data;
//     })
//     .catch(error => console.error('Erro ao carregar navbar:', error));

//     const form = document.getElementById('reservaForm');

//     atualizarHoraDia()
//     const hoje = new Date();
//     document.getElementById('data').value = hoje.toISOString().split('T')[0];
//     const horas = String(hoje.getHours()).padStart(2, '0');
//     const minutos = String(hoje.getMinutes()).padStart(2, '0');
//     document.getElementById('hora').value = `${horas}:${minutos}`;

//     form.addEventListener('submit', async function (e) {
//         e.preventDefault();

//         const origem = document.getElementById('origem').value;
//         const destino = document.getElementById('destino').value;
//         const data = document.getElementById('data').value;
//         const hora = document.getElementById('hora').value;
//         const passageiros = document.getElementById('passageiros').value;
//         const dataHoraStr = `${data}T${hora}`;

//         try {
//             const nextTrain = await eel.get_next_train(origem, destino, dataHoraStr)();

//             if (nextTrain) {
//                 const options = {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                 };
//                 const formattedDate = new Date(nextTrain).toLocaleDateString('pt-PT', options);

//                 const modalResumo = document.getElementById('modalResumoTexto');
//                 modalResumo.innerHTML = `
//                     <strong>Origem:</strong> ${origem}<br>
//                     <strong>Destino:</strong> ${destino}<br>
//                     <strong>Próximo comboio disponível:</strong> ${formattedDate}<br>
//                     <strong>Passageiros:</strong> ${passageiros}
//                 `;

//                 const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
//                 reservaModal.show();
//             } else {
//                 alert("Não há comboios disponíveis para o horário selecionado.");
//             }
//         } catch (error) {
//             console.error("Erro ao processar reserva:", error);
//             alert("Ocorreu um erro ao processar a reserva.");
//         }
//     });
// });

// const form = document.getElementById('reservaForm');
// const resumo = document.getElementById('resumoReserva');
// const modalResumo = document.getElementById('modalResumoTexto');

// function atualizarHoraDia(){
//     const dataInput = document.getElementById("data");
//     const horaInput = document.getElementById("hora");

//     const hoje = new Date();
//     const ano = hoje.getFullYear();
//     const mes = String(hoje.getMonth() + 1).padStart(2, '0');
//     const dia = String(hoje.getDate()).padStart(2, '0');
//     const dataHoje = `${ano}-${mes}-${dia}`;
//     dataInput.min = dataHoje;

//     dataInput.addEventListener("change", function () {
//         if (dataInput.value === dataHoje) {
//             const agora = new Date();
//             const horas = String(agora.getHours()).padStart(2, '0');
//             const minutos = String(agora.getMinutes()).padStart(2, '0');
//             horaInput.min = `${horas}:${minutos}`;
//         } else {
//             horaInput.removeAttribute("min");
//         }
//     });
// }

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
            optionDestino.value = destino.name;
            optionDestino.textContent = destino.name;
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
        if (option.textContent.toLowerCase() === valor.toLowerCase()) {
            select.value = option.value;
            return true;
        }
    }

    alert(`Estação "${valor}" não encontrada.`);
    return false;
}

async function pesquisarHorarios(origem, destino) {
    try {
        // Aqui assumes que existe algo do género no teu backend
        const horarios = await eel.get_all_horarios(origem, destino)();

        const tabela = document.getElementById("tabelaHorarios");
        tabela.innerHTML = "";

        if (horarios.length === 0) {
            tabela.innerHTML = "<tr><td colspan='3'>Sem horários disponíveis.</td></tr>";
            return;
        }

        horarios.forEach(horario => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${horario.data}</td>
                <td>${horario.hora}</td>
                <td>${horario.duracao}</td>
            `;
            tabela.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar horários:", error);
        alert("Erro ao carregar horários.");
    }
}

window.onload = async function() {
    const form = document.getElementById('reservaForm');
    const resumo = document.getElementById('resumoReserva');
    const modalResumo = document.getElementById('modalResumoTexto');

    const origem = sessionStorage.getItem("origem");
    const destino = sessionStorage.getItem("destino");

    await carregarDestinos();

    if (origem && destino) {
        // Coloca nos selects, se houver
        if (document.getElementById("origem"))
            document.getElementById("origem").value = origem;
        if (document.getElementById("destino"))
            document.getElementById("destino").value = destino;

        // Chama a função para pesquisar horários
        await pesquisarHorarios(origem, destino);

        // Limpar da sessionStorage (opcional)
        sessionStorage.removeItem("origem");
        sessionStorage.removeItem("destino");
    }

    // Após carregar destinos
    const origemGuardada = sessionStorage.getItem("origem");
    const destinoGuardada = sessionStorage.getItem("destino");

    if (origemGuardada) {
        selecionarValorNoSelect("origem", origemGuardada);
        sessionStorage.removeItem("origem");
    }
    if (destinoGuardada) {
        selecionarValorNoSelect("destino", destinoGuardada);
        sessionStorage.removeItem("destino");
    }

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

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        showSpinner();
        
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const passageiros = document.getElementById('passageiros').value;
        const dataHoraStr = `${data}T${hora}`;

        try {
            const nextTrain = await eel.get_next_train(origem, destino, dataHoraStr)();

            hideSpinner()

            if (nextTrain) {
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                const formattedDate = new Date(nextTrain).toLocaleDateString('pt-PT', options);

                const modalResumo = document.getElementById('modalResumoTexto');
                modalResumo.innerHTML = `
                    <strong>Origem:</strong> ${origem}<br>
                    <strong>Destino:</strong> ${destino}<br>
                    <strong>Próximo comboio disponível:</strong> ${formattedDate}<br>
                    <strong>Passageiros:</strong> ${passageiros}
                `;

                const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
                
                reservaModal.show();

                document.querySelector('#confirmarReservaBtn').addEventListener('click', function() {
                    eel.adicionar_reserva(origem, destino, formattedDate, passageiros)()
                    window.location.href = "reservas_all.html";
                });

                document.querySelector('#maisHorasReservaBtn').addEventListener('click', function () {
                    const origem = document.getElementById('origem').value;
                    const destino = document.getElementById('destino').value;
                    const url = `ver_horario_form.html?origem=${encodeURIComponent(origem)}&destino=${encodeURIComponent(destino)}`;
                    window.location.href = url;
                });

                document.querySelector('#cancelarReservaBtn').addEventListener('click', function() {
                    console.log("entrou");
                    reservaModal.hide();
                });
            } else {
                hideSpinner();
                alert("Não há comboios disponíveis para o horário selecionado.");
            }
        } catch (error) {
            console.error("Erro ao processar reserva:", error);
            alert("Ocorreu um erro ao processar a reserva.");
        }
    });
};