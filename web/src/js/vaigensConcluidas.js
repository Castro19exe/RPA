import { parseDataHoraPt } from './utils.js';
document.addEventListener('DOMContentLoaded', function() {
    carregarViagensConcluidas();
});


async function carregarViagensConcluidas() {
    try {
        const reservas = await eel.get_reservas_eel()();
        
        const tbody = document.getElementById('reservasTableBody');
        tbody.innerHTML = '';
        reservas.forEach(reserva => {
            const dataHoraReserva = parseDataHoraPt(reserva.data);
            const agora = new Date();
        
            if (reserva.canceled === 0 && dataHoraReserva && dataHoraReserva < agora) {
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
        
                
                tbody.appendChild(tr);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}