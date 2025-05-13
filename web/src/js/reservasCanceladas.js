import { parseDataHoraPt } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    fetch('src/shared/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;

        const btnReservas = document.getElementById("btn-reservas");
        if (btnReservas) {
            btnReservas.classList.add("nav-link", "active");
        }
    })
    .catch(error => console.error('Erro ao carregar navbar:', error));

    carregarReservasCanceladas();
});

async function carregarReservasCanceladas() {
    try {
        const reservas = await eel.get_reservas_eel()();
        
        // Obter o elemento tbody da tabela
        const tbody = document.getElementById('reservasTableBody');
        tbody.innerHTML = '';
        reservas.forEach(reserva => {
            const dataHoraReserva = parseDataHoraPt(reserva.data);
            const agora = new Date();
        
            // Ignorar reservas já passadas
            if (reserva.canceled === 1 && dataHoraReserva && dataHoraReserva > agora) {
                const tr = document.createElement('tr');
        
                const tdOrigem = document.createElement('td');
                tdOrigem.textContent = reserva.origem;
                tr.appendChild(tdOrigem);
        
                const tdDestino = document.createElement('td');
                tdDestino.textContent = reserva.destino;
                tr.appendChild(tdDestino);
        
                const tdData = document.createElement('td');
                tdData.textContent = reserva.data;
                tr.appendChild(tdData);
        
                const tdPassageiros = document.createElement('td');
                tdPassageiros.textContent = reserva.passageiros;
                tr.appendChild(tdPassageiros);
        
                const tdAcoes = document.createElement('td');
        
                const minutosRestantes = (dataHoraReserva - agora) / (1000 * 60);
        
                if (minutosRestantes > 15) {
                    
                    const btnRemarcar = document.createElement('button');
                    btnRemarcar.className = 'btn btn-primary btn-sm';
                    btnRemarcar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Remarcar';
                    btnRemarcar.onclick = () => remarcarReserva(reserva.id);
                    tdAcoes.appendChild(btnRemarcar);
                } else {
                    marcar = document.createElement('button');
                    btnRemarcar.className = 'btn btn-primary btn-sm disabled';
                    btnRemarcar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Remarcar';
                    tdAcoes.appendChild(btnRemarcar);
                }
        
                tr.appendChild(tdAcoes);
                tbody.appendChild(tr);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}




async function remarcarReserva(id) {
    const confirmado = await mostrarModalConfirmacaoBootstrap();

    if (confirmado) {
        try {
            await eel.remarcar_reserva(id)();
            carregarReservasCanceladas();
        } catch (error) {
            console.error('Erro ao remarcar reserva:', error);
        }
    }
}

function mostrarModalConfirmacaoBootstrap() {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('destinoModal');
        const confirmarBtn = document.getElementById('confirmarAtualizacaoBtn');
        const cancelarBtns = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');

        const bootstrapModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
        });

        const cleanup = () => {
            confirmarBtn.removeEventListener('click', onConfirmar);
            cancelarBtns.forEach(btn => btn.removeEventListener('click', onCancelar));
        };

        const onConfirmar = () => {
            cleanup();
            bootstrapModal.hide();
            resolve(true);
        };

        const onCancelar = () => {
            cleanup();
            resolve(false);
        };

        confirmarBtn.addEventListener('click', onConfirmar);
        cancelarBtns.forEach(btn => btn.addEventListener('click', onCancelar));

        bootstrapModal.show();
    });
}