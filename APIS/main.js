// main.js - Funciones básicas compartidas

// Funciones para mostrar estados
function mostrarCarga(elementId) {
    document.getElementById(elementId).innerHTML = '<p class="loading">Cargando...</p>';
}

function mostrarError(elementId, mensaje) {
    document.getElementById(elementId).innerHTML = `<p class="error">Error: ${mensaje}</p>`;
}

// Mensaje cuando se carga la página
window.onload = function() {
    console.log('APIs cargadas correctamente');
};