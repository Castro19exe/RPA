import { showSpinner, hideSpinner } from './utils.js';

let destinos = [];
let paginaAtual = 1;
const registosPorPagina = 30;

document.addEventListener('DOMContentLoaded', function() {
    fetch('src/shared/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;

        const btnDestinos = document.getElementById("btn-destinos");
        if (btnDestinos) {
            btnDestinos.classList.add("nav-link", "active");
        }
    })
    .catch(error => console.error('Erro ao carregar navbar:', error));

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

async function renderizarTabela(pagina) {
    const tbody = document.getElementById('destinosTableBody');
    tbody.innerHTML = '';

    const inicio = (pagina - 1) * registosPorPagina;
    const fim = inicio + registosPorPagina;
    const paginaDestinos = destinos.slice(inicio, fim);

    paginaDestinos.forEach(destino => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = destino.id;
        tr.appendChild(tdId);

        const tdNome = document.createElement('td');
        tdNome.textContent = destino.name;
        tr.appendChild(tdNome);

        const tdStatus = document.createElement('td');
        
        const btnStatus = document.createElement('button');
        btnStatus.value = destino.status
        tdStatus.appendChild(btnStatus);

        if(destino.status == 1) {
            btnStatus.className = "btn btn-danger"
            btnStatus.innerHTML = "<i class='fa-solid fa-ban'></i> Disable"
        }
        else {
            btnStatus.className = "btn btn-success"
            btnStatus.innerHTML = "<i class='fa-solid fa-circle-check'></i> Enable"
        }

        btnStatus.onclick = async function() {
            try {
                const novoStatus = await eel.update_status(destino.id)();

                // Atualizar interface diretamente sem refazer a tabela toda
                destino.status = novoStatus;

                if (novoStatus === 1) {
                    btnStatus.className = "btn btn-danger";
                    btnStatus.innerHTML = "<i class='fa-solid fa-ban'></i> Disable";
                } else {
                    btnStatus.className = "btn btn-success";
                    btnStatus.innerHTML = "<i class='fa-solid fa-circle-check'></i> Enable";
                }
            } catch (error) {
                console.error("Erro ao alternar status:", error);
                alert("Erro ao atualizar o status do destino.");
            }
        };

        tr.appendChild(tdStatus);
        tbody.appendChild(tr);
    });

    renderizarPaginacao();
}

async function renderizarPaginacao() {
    const totalPaginas = Math.ceil(destinos.length / registosPorPagina);
    const paginacaoDiv = document.getElementById('paginacao');
    paginacaoDiv.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = `btn btn-sm ${i === paginaAtual ? 'btn-primary' : 'btn-outline-primary'} mx-1`;
        btn.textContent = i;
        btn.onclick = () => {
            paginaAtual = i;
            renderizarTabela(paginaAtual);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginacaoDiv.appendChild(btn);
    }
}

async function atualizarListaDestinos() {
    showSpinner()
    await eel.update_all_destination()();
    hideSpinner();
    carregarDestinos()
}

async function carregarDestinos() {
    try {
        destinos = await eel.get_all_destinos_nome()();
        paginaAtual = 1;
        renderizarTabela(paginaAtual);
    } catch (error) {
        console.error('Erro ao carregar destinos:', error);
        // showToast("Ocorreu um erro ao carregar os destinos.");
    }
}