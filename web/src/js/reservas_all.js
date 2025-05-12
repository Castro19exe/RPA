import { parseDataHoraPt } from './utils.js';
document.addEventListener('DOMContentLoaded', function() {
    carregarReservas();



});


async function carregarReservas() {
    try {
        const reservas = await eel.get_reservas_eel()();
        
        // Obter o elemento tbody da tabela
        const tbody = document.getElementById('reservasTableBody');
        tbody.innerHTML = '';
        
        reservas.forEach(reserva => {
            const dataHoraReserva = parseDataHoraPt(reserva.data);
            const agora = new Date();
        
            // Ignorar reservas já passadas
            if (reserva.canceled === 0 && dataHoraReserva && dataHoraReserva > agora) {
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
                    const btnCancelar = document.createElement('button');
                    btnCancelar.className = 'btn btn-danger btn-sm';
                    btnCancelar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Cancelar';
                    btnCancelar.onclick = () => cancelarReserva(reserva.id);
                    tdAcoes.appendChild(btnCancelar);
                } else {
                    const btnCancelar = document.createElement('button');
                    btnCancelar.className = 'btn btn-danger btn-sm disabled';
                    btnCancelar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Cancelar';
                    tdAcoes.appendChild(btnCancelar);
                }
        
                tr.appendChild(tdAcoes);
                tbody.appendChild(tr);
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}

async function cancelarReserva(id) {
    const confirmado = await mostrarModalConfirmacaoBootstrap();

    if (confirmado) {
        try {
            await eel.cancelar_reserva(id)();
            carregarReservas();
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            alert('Ocorreu um erro ao cancelar a reserva.');
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