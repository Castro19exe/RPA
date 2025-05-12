import { showSpinner, hideSpinner } from './utils.js';

window.onload = async function () {
    carregarDestinos();

    document.getElementById("consultarSubmit").onclick = async function () {
        const btn = this;
        btn.disabled = true;

        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;

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
                <h1 class="text-center mb-4">Horários disponíveis de ${origem} para ${destino}</h1>
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
    const text = `Reservou ${dataSelecionada} às ${horarioISO}`;
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
