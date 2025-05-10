import { showSpinner, hideSpinner } from './utils.js';
window.onload = async function() {

    carregarDestinos()
    //consultas
    document.getElementById("consultarSubmit").onclick = async function() {
        const btn = this;
        btn.disabled = true;
        
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        showSpinner()
        const hours = await eel.get_train_hours_serialized(origem, destino)();
        hideSpinner()

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
                    <tbody id="horarioTableBody">
                    </tbody>
                </table>
            </div>
        `;
        wrapper.insertBefore(new_html, wrapper.querySelector('footer'));

        const dateSelector = document.getElementById('dateSelector');
        const dias = ['Hoje', 'Amanhã'];

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
        
        let selectedDate = null;
        document.querySelectorAll('.dia-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('btn-primary'));
                this.classList.add('btn-primary');
                selectedDate = this.dataset.date;
            });
        });
        const tbody = document.getElementById("horarioTableBody");
        console.log(hours)
        hours.forEach(horarioISO => {
            console.log(horarioISO)
            const dateObj = new Date(horarioISO);
            const data = dateObj.toLocaleDateString('pt-PT');
            const hora = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${hora}</td>
                <td>
                    <button class="btn btn-success btn-sm reservar-btn" data-horario="${horarioISO}">
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
    };
}


async function reservarHorario(horarioISO, dataSelecionada) {
    console.log("Reservar:");
    console.log("Data selecionada:", dataSelecionada);
    console.log("Hora ISO selecionada:", horarioISO);
    const text = `Reservou ${dataSelecionada} às ${horarioISO}`
    alert(text)
    // falta aqui a situação
}


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