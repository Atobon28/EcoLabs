const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let users = [
  {
    id: 1,
    name: "John Doe",
  },
];

// Variables simples para el juego
let jugadoresConectados = 0;
let sala = {
  jugador1: null,
  jugador2: null,
  jugadas: {},
  estado: 'esperando'
};

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", (req, res) => {
  const { id, name } = req.body;
  users.push({ id, name });
  res.send(users);
});

app.post("/change-screen", (req, res) => {
  io.emit("next-screen");
  res.send({ message: "Cambio de pantalla exitoso" });
});

// Socket.IO para el juego minimalista
io.on("connection", (socket) => {
  jugadoresConectados++;
  
  // Asignar jugadores
  if (!sala.jugador1) {
    sala.jugador1 = socket.id;
  } else if (!sala.jugador2) {
    sala.jugador2 = socket.id;
    // Empezar juego cuando hay 2
    io.emit("start-game");
  }
  
  // Enviar estado actualizado
  io.emit("game-status", {
    conectados: jugadoresConectados,
    listo: jugadoresConectados === 2
  });
  
  // Cuando alguien juega
  socket.on("play", (choice) => {
    sala.jugadas[socket.id] = choice;
    
    // Si ambos jugaron, calcular resultado
    if (Object.keys(sala.jugadas).length === 2) {
      const jugador1Id = sala.jugador1;
      const jugador2Id = sala.jugador2;
      const choice1 = sala.jugadas[jugador1Id];
      const choice2 = sala.jugadas[jugador2Id];
      
      let resultado1, resultado2;
      
      if (choice1 === choice2) {
        // Empate
        resultado1 = resultado2 = {
          message: "Empate",
          you: choice1,
          opponent: choice2
        };
      } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "paper" && choice2 === "rock") ||
        (choice1 === "scissors" && choice2 === "paper")
      ) {
        // Jugador 1 gana
        resultado1 = { message: "Ganaste", you: choice1, opponent: choice2 };
        resultado2 = { message: "Perdiste", you: choice2, opponent: choice1 };
      } else {
        // Jugador 2 gana
        resultado1 = { message: "Perdiste", you: choice1, opponent: choice2 };
        resultado2 = { message: "Ganaste", you: choice2, opponent: choice1 };
      }
      
      // Enviar resultados
      io.to(jugador1Id).emit("game-result", resultado1);
      io.to(jugador2Id).emit("game-result", resultado2);
      
      // Limpiar jugadas
      sala.jugadas = {};
    }
  });
  
  socket.on("disconnect", () => {
    jugadoresConectados--;
    
    // Reiniciar sala si alguien se va
    if (socket.id === sala.jugador1 || socket.id === sala.jugador2) {
      sala = { jugador1: null, jugador2: null, jugadas: {}, estado: 'esperando' };
      io.emit("player-left");
    }
    
    io.emit("game-status", {
      conectados: jugadoresConectados,
      listo: jugadoresConectados === 2
    });
  });
});

httpServer.listen(5050, () =>
  console.log(`Server running at http://localhost:${5050}`)
);