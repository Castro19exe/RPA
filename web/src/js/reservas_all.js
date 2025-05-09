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
            const tr = document.createElement('tr');
            alert(reserva)
            if(reserva.canceled == 0){
            
                const tdOrigem = document.createElement('td');
                tdOrigem.textContent = reserva.origem;
                tr.appendChild(tdOrigem);
                
                const tdDestino = document.createElement('td');
                tdDestino.textContent = reserva.destino;
                tr.appendChild(tdDestino);
                
                // dividir data e hora
                const tdData = document.createElement('td');
                tdData.textContent = reserva.data;
                tr.appendChild(tdData);
    
                const tdHora = document.createElement('td');
                tdHora.textContent = reserva.data;
                tr.appendChild(tdHora);
                const tdAcoes = document.createElement('td');
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-danger btn-sm';
                btnEliminar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Cancelar';
                btnEliminar.onclick = () => eliminarDestino(reserva.id);
                tdAcoes.appendChild(btnEliminar);
                tr.appendChild(tdAcoes);
            
                tbody.appendChild(tr);
            }

        });
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}

async function eliminarDestino(id) {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
        try {

            await eel.delete_destination(id)();
            
            carregarReservas();
            
        } catch (error) {
            console.error('Erro ao eliminar reserva:', error);
            alert('Ocorreu um erro ao eliminar o reserva.');
        }
    }
}