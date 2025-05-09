// para spinners e cenas comuns 

function showSpinner() {
    let spinner = document.getElementById('fullscreen-spinner');
    
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'fullscreen-spinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '0';
        spinner.style.left = '0';
        spinner.style.width = '100%';
        spinner.style.height = '100%';
        spinner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.style.alignItems = 'center';
        spinner.style.zIndex = '9999';
        
        const spinnerIcon = document.createElement('div');
        spinnerIcon.className = 'spinner-border text-light';
        spinnerIcon.style.width = '3rem';
        spinnerIcon.style.height = '3rem';
        spinnerIcon.setAttribute('role', 'status');
        
        const visuallyHidden = document.createElement('span');
        visuallyHidden.className = 'visually-hidden';
        visuallyHidden.textContent = 'Carregando...';
        
        spinnerIcon.appendChild(visuallyHidden);
        spinner.appendChild(spinnerIcon);
        document.body.appendChild(spinner);
    }
    
    spinner.style.display = 'flex';
}


function hideSpinner() {
    const spinner = document.getElementById('fullscreen-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Mostra uma mensagem de toast (notificação temporária)
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do toast (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos (opcional, padrão: 3000)
 */


function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type}`;
    toast.style.position = 'relative';
    toast.style.marginBottom = '10px';
    
    const toastBody = document.createElement('div');
    toastBody.className = 'd-flex';
    
    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-body';
    toastMessage.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
    closeBtn.setAttribute('data-bs-dismiss', 'toast');
    closeBtn.onclick = () => toast.remove();
    
    toastBody.appendChild(toastMessage);
    toastBody.appendChild(closeBtn);
    toast.appendChild(toastBody);
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
    return container;
}

export { showSpinner, hideSpinner, showToast };