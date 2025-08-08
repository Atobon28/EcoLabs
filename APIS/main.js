function mostrarCarga(elementId) {
    document.getElementById(elementId).innerHTML = '<p class="loading">Cargando...</p>';
}

function mostrarError(elementId, mensaje) {
    document.getElementById(elementId).innerHTML = `<p class="error">Error: ${mensaje}</p>`;
}

window.onload = function() {
    console.log('APIs cargadas correctamente');
};