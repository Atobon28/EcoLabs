# Investigación Socket.IO

## 1. ¿Cómo contar el número de clientes conectados y notificarle a todos el número de clientes conectados a todos?

Para contar los clientes conectados, usamos `io.sockets.sockets.size` que nos da el número total de conexiones. Luego usamos `io.emit()` para enviar este número a todos los clientes conectados:

```javascript
// En el servidor
let clientesConectados = 0;

io.on("connection", (socket) => {
  clientesConectados++;
  // Notificar a todos los clientes el nuevo número
  io.emit("clientes-conectados", clientesConectados);
  
  socket.on("disconnect", () => {
    clientesConectados--;
    io.emit("clientes-conectados", clientesConectados);
  });
});
```

## 2. ¿Cómo identificar a cada cliente que se une con un id único?

Socket.IO asigna automáticamente un ID único a cada socket cuando se conecta. Se puede acceder con `socket.id`:

```javascript
io.on("connection", (socket) => {
  console.log("Cliente conectado con ID:", socket.id);
  
  // También podemos crear nuestro propio sistema de IDs
  const clienteId = `cliente_${Date.now()}_${Math.random()}`;
  socket.clienteId = clienteId;
});
```

## 3. ¿Cómo emitir eventos para un sólo cliente de todos los conectados?

Para enviar un evento a un cliente específico, usamos `socket.emit()` (para el cliente actual) o `io.to(socketId).emit()` (para un cliente específico por su ID):

```javascript
// Para el cliente actual que envió el mensaje
socket.emit("mensaje-personal", "Solo tu ves esto");

// Para un cliente específico por su ID
io.to(socketIdEspecifico).emit("mensaje-privado", "Mensaje solo para ti");
```

## 4. ¿Cómo identificar cuando un usuario se desconectó?

Socket.IO tiene un evento built-in llamado `disconnect` que se ejecuta automáticamente cuando un cliente se desconecta:

```javascript
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  
  // Este evento se ejecuta cuando el cliente se desconecta
  socket.on("disconnect", (razon) => {
    console.log("Cliente desconectado:", socket.id);
    console.log("Razón:", razon);
    
    // Aquí podemos hacer limpieza o notificar a otros usuarios
    io.emit("usuario-desconectado", socket.id);
  });
});
```