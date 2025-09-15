// Conectar al servidor de Socket.IO
const socket = io("/", { path: "/real-time" });

// Referencias a elementos del DOM
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const status = document.getElementById("status");
const choices = document.getElementById("choices");
const message = document.getElementById("message");
const details = document.getElementById("details");
const goBackButton = document.getElementById("go-screen-back");

// Traducir opciones para mostrar
const translate = {
    rock: "Piedra",
    paper: "Papel", 
    scissors: "Tijeras"
};

// Mostrar screen1 al inicio y ocultar screen2
screen1.style.display = "block";
screen2.style.display = "none";

socket.on("connect", () => {
    status.textContent = "Esperando otro jugador...";
});

socket.on("game-status", (data) => {
    if (data.conectados === 1) {
        status.textContent = "Esperando otro jugador...";
        status.className = "waiting";
        choices.style.display = "none";
    } else if (data.conectados >= 2 && data.listo) {
        status.textContent = "Listo para jugar";
        status.className = "ready";
    }
});

socket.on("start-game", () => {
    status.textContent = "Elige tu jugada";
    choices.style.display = "flex";
    screen2.style.display = "none";
    screen1.style.display = "block";
});

socket.on("game-result", (data) => {
    screen1.style.display = "none";
    screen2.style.display = "block";
    
    message.textContent = data.message;
    
    // Agregar clase para colores
    message.className = "";
    if (data.message === "Ganaste") {
        message.className = "win";
    } else if (data.message === "Perdiste") {
        message.className = "lose";
    } else {
        message.className = "tie";
    }
    
    details.textContent = `Tú: ${translate[data.you]} vs ${translate[data.opponent]}`;
});

socket.on("player-left", () => {
    status.textContent = "Esperando otro jugador...";
    status.className = "waiting";
    choices.style.display = "none";
    screen2.style.display = "none";
    screen1.style.display = "block";
});

// Mantener funcionalidad original de cambio de pantalla
socket.on("next-screen", () => {
    screen1.style.display = "none";
    screen2.style.display = "block";
    // Mostrar mensaje por defecto si no es resultado de juego
    if (!message.textContent) {
        message.textContent = "Screen 2";
        message.className = "";
        details.textContent = "Cambiado desde app1";
    }
});

function play(choice) {
    socket.emit("play", choice);
    choices.style.display = "none";
    status.textContent = "Esperando al otro jugador...";
}

// Botón de volver/jugar otra vez
goBackButton.addEventListener("click", () => {
    screen1.style.display = "block";
    screen2.style.display = "none";
    
    // Limpiar mensajes
    message.textContent = "";
    details.textContent = "";
    
    // Mostrar opciones si hay 2 jugadores
    status.textContent = "Elige tu jugada";
    choices.style.display = "flex";
});

socket.on("disconnect", () => {
    status.textContent = "Desconectado";
    choices.style.display = "none";
});

console.log("Juego minimalista cargado");