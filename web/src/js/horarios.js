import { showSpinner, hideSpinner } from './utils.js';

let origem, destino;

window.onload = async function () {
    carregarDestinos();

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

    document.getElementById("consultarSubmit").onclick = async function () {
        const btn = this;
        btn.disabled = true;

        origem = document.getElementById('origem').value;
        destino = document.getElementById('destino').value;

        showSpinner();
        const hours = await eel.get_train_hours_serialized(origem, destino)();
        hideSpinner();

        const wrapper = document.querySelector('.wrapper');
        [...wrapper.children].forEach(child => {
            if (!child.matches('nav') && !child.matches('footer')) {
                child.remove();
            }
        });

        const new_html = document.createElement('div');
        new_html.classList.add('container', 'mt-4');
        new_html.innerHTML = `
            <div class="container my-5">
                <h1 class="display-4 text-center mb-4">Horários disponíveis de ${origem} para ${destino}</h1>
            </div>
            <div class="d-flex justify-content mb-3" id="dateSelector"></div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Hora</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="horarioTableBody"></tbody>
                </table>
            </div>
        `;
        wrapper.insertBefore(new_html, wrapper.querySelector('footer'));

        const dateSelector = document.getElementById('dateSelector');
        let selectedDate = null;

        for (let i = 0; i < 7; i++) {
            const btn = document.createElement('button');
            const data = new Date();
            data.setDate(data.getDate() + i);

            btn.classList.add('btn', 'btn-outline-secondary', 'mx-1', 'dia-btn');
            btn.dataset.date = data.toISOString().split('T')[0];

            if (i === 0) {
                btn.textContent = 'Hoje';
            } else if (i === 1) {
                btn.textContent = 'Amanhã';
            } else {
                btn.textContent = data.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
            }

            dateSelector.appendChild(btn);
        }

        const primeiroBtn = document.querySelector('.dia-btn');
        if (primeiroBtn) {
            primeiroBtn.classList.add('btn-primary');
            selectedDate = primeiroBtn.dataset.date;
        }

        document.querySelectorAll('.dia-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('btn-primary'));
                this.classList.add('btn-primary');
                selectedDate = this.dataset.date;
                renderizarHorarios(hours, selectedDate);
            });
        });

        renderizarHorarios(hours, selectedDate);
    };
};

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

function renderizarHorarios(hours, selectedDate) {
    const tbody = document.getElementById("horarioTableBody");
    tbody.innerHTML = '';

    const hojeISO = new Date().toISOString().split('T')[0];
    const isHoje = selectedDate === hojeISO;

    hours.forEach(horarioISO => {
        const dateObj = new Date(horarioISO);
        const hora = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

        let desativado = false;

        if (isHoje) {
            const agora = new Date();
            const horaViagem = new Date();
            horaViagem.setHours(dateObj.getHours(), dateObj.getMinutes(), 0, 0);
            const diferencaMinutos = (horaViagem - agora) / (1000 * 60);
            desativado = diferencaMinutos < 15;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${hora}</td>
            <td>
                <button class="btn btn-success btn-sm reservar-btn" data-horario="${horarioISO}" ${desativado ? 'disabled' : ''}>
                    Reservar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.reservar-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const horario = this.dataset.horario;
            if (!selectedDate) {
                alert('Por favor seleciona um dia antes de reservar.');
                return;
            }
            reservarHorario(horario, selectedDate);
        });
    });
}

async function reservarHorario(horarioISO, dataSelecionada) {
    console.log("Reservar:");
    console.log("Data selecionada:", dataSelecionada);
    console.log("Hora ISO selecionada:", horarioISO);

    // Combinar a dataSelecionada com as horas e minutos de horarioISO
    const horaObj = new Date(horarioISO);
    const [ano, mes, dia] = dataSelecionada.split('-');
    const data = new Date(ano, mes - 1, dia, horaObj.getHours(), horaObj.getMinutes());

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = new Date(data).toLocaleDateString('pt-PT', options);

    const modalResumo = document.getElementById('modalResumoTexto');
    modalResumo.innerHTML = `
        <strong>Origem:</strong> ${origem}<br>
        <strong>Destino:</strong> ${destino}<br>
        <strong>Data:</strong> ${formattedDate}<br>
        <strong>Numero de Passageiros:</strong><br>
        <input type="number" class="form-control" id="passageiros" min="1" max="10" value="1" required>
    `;

    const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
    reservaModal.show();

    document.querySelector('#confirmarReservaBtn').addEventListener('click', function () {
        const passageirosInput = document.getElementById('passageiros');
        const passageiros = parseInt(passageirosInput.value, 10);
    
        if (!passageiros || passageiros < 1) {
            alert('Por favor introduz um número válido de passageiros.');
            return;
        }
    
        eel.adicionar_reserva(origem, destino, formattedDate, passageiros)();
        window.location.href = "reservas_all.html";
    });
    

    const text = `Reservou ${dataSelecionada} às ${horaObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    alert(text);
}

async function carregarDestinos() {
    try {
        const destinos = await eel.get_destinos_nome()();

        const selectDestino = document.getElementById('destino');
        const selectOrigem = document.getElementById('origem');

        while (selectDestino.options.length > 1) {
            selectDestino.remove(1);
        }
        while (selectOrigem.options.length > 1) {
            selectOrigem.remove(1);
        }

        destinos.forEach(destino => {
            const optionDestino = document.createElement('option');
            optionDestino.value = destino.name;
            optionDestino.textContent = destino.name;
            selectDestino.appendChild(optionDestino);

            const optionOrigem = optionDestino.cloneNode(true);
            selectOrigem.appendChild(optionOrigem);
        });
    } catch (error) {
        console.error('Erro ao carregar destinos:', error);
    }
}
