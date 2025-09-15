const socket = io("/", { path: "/real-time" });

// Referencias a elementos
const screen1 = document.getElementById("screen1");

// Mostrar screen1 al inicio
screen1.style.display = "block";

// Botón "Get users"
document.getElementById("get-btn").addEventListener("click", getUsers);

// Botón "Change screen on app 2" 
document.getElementById("change-screen-btn").addEventListener("click", sendEventChangeScreen);

// Función para obtener usuarios
function getUsers() {
  fetch("http://localhost:5050/users")
    .then((response) => response.json())
    .then((data) => {
      console.log("Usuarios obtenidos:", data);
      // Mostrar en la página también (opcional)
      alert(`Usuarios: ${data.map(u => u.name).join(', ')}`);
    })
    .catch((error) => {
      console.error("Error al obtener usuarios:", error);
      alert("Error al obtener usuarios");
    });
}

// Función para cambiar pantalla en app2
async function sendEventChangeScreen() {
  try {
    // Opción 1: Usando la API REST
    let changeEventResponse = await fetch("http://localhost:5050/change-screen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    changeEventResponse = await changeEventResponse.json();
    console.log("Respuesta del servidor:", changeEventResponse);
    alert("Pantalla cambiada en app2!");
    
  } catch (error) {
    console.error("Error al cambiar pantalla:", error);
    alert("Error al cambiar pantalla");
  }
}

// Eventos de Socket.IO (para el futuro o debugging)
socket.on("connect", () => {
  console.log("App1 conectada al servidor");
});

socket.on("disconnect", () => {
  console.log("App1 desconectada del servidor");
});

console.log("App1 cargada correctamente");