import { showSpinner, hideSpinner } from './utils.js';
document.addEventListener('DOMContentLoaded', function() {
    carregarDestinos();



    const atualizarBtn = document.getElementById('atualizarDestinosBtn');
    if (atualizarBtn) {
        atualizarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('destinoModal'));
            modal.show();
        });
    }
    
    const confirmarBtn = document.getElementById('confirmarAtualizacaoBtn');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', function() {
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('destinoModal'));
            modal.hide();
            
            
            atualizarListaDestinos();
        });
    }
});
async function atualizarListaDestinos() {
    showSpinner()
    
    await eel.update_all_destination()();
    hideSpinner();
    carregarDestinos()
}

async function carregarDestinos() {
    try {
        // Chamar a função Python via Eel para obter os destinos
        const destinos = await eel.get_destinations_eel()();
        
        // Obter o elemento tbody da tabela
        const tbody = document.getElementById('destinosTableBody');
        tbody.innerHTML = '';
        
        destinos.forEach(destino => {
            const tr = document.createElement('tr');
        
            const tdId = document.createElement('td');
            tdId.textContent = destino.id;
            tr.appendChild(tdId);
        
            const tdNome = document.createElement('td');
            tdNome.textContent = destino.name;
            tr.appendChild(tdNome);
        
            const tdAcoes = document.createElement('td');
            const btnEditar = document.createElement('button');
            const btnEliminar = document.createElement('button');
            btnEditar.className = 'btn btn-warning btn-sm';
            btnEditar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Editar';
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.innerHTML = '<i class="fas fa-trash-alt me-1"></i>Eliminar';
            btnEliminar.onclick = () => eliminarDestino(destino.id);
            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnEliminar);
            tr.appendChild(tdAcoes);
        
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar destinos:', error);
        showToast("Ocorreu um erro ao carregar os destinos.");
    }
}

async function eliminarDestino(id) {
    if (confirm('Tem certeza que deseja eliminar este destino?')) {
        try {
            // Chamar a função Python via Eel para eliminar o destino
            await eel.delete_destination(id)();
            
            // Recarregar a lista de destinos
            carregarDestinos();
            
            alert('Destino eliminado com sucesso!');
        } catch (error) {
            console.error('Erro ao eliminar destino:', error);
            alert('Ocorreu um erro ao eliminar o destino.');
        }
    }
}