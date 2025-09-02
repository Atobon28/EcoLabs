const URL_SERVIDOR = 'http://localhost:5050';

// Variables para almacenar el estado actual
let repartidorActual = null; // Información del repartidor logueado
let ordenesDisponibles = []; // Lista de órdenes que puede tomar
let misOrdenes = []; // Órdenes que tengo asignadas
let ordenActual = null; // Orden que estoy viendo en detalle

// Función para mostrar mensajes al usuario
function mostrarMensaje(elementId, mensaje, tipo = 'info') {
    const elementoMensaje = document.getElementById(elementId);
    if (!elementoMensaje) return;
    
    elementoMensaje.textContent = mensaje;
    elementoMensaje.className = `mensaje ${tipo}`;
    elementoMensaje.style.display = 'block';
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        elementoMensaje.style.display = 'none';
    }, 5000);
}

// Función para mostrar/ocultar el overlay de carga
function mostrarLoading(mostrar = true) {
    const overlay = document.getElementById('overlayLoading');
    overlay.style.display = mostrar ? 'flex' : 'none';
}

// Función para cambiar entre pantallas
function cambiarPantalla(pantallaId) {
    // Ocultar todas las pantallas
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(pantalla => pantalla.classList.remove('activa'));
    
    // Mostrar la pantalla seleccionada
    document.getElementById(pantallaId).classList.add('activa');
}

// Función para formatear números como plata
function formatearDinero(cantidad) {
    return new Intl.NumberFormat('es-CO').format(cantidad);
}

// Función para formatear fechas de manera legible
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función general para hacer peticiones al servidor
async function hacerPeticion(endpoint, metodo = 'GET', datos = null) {
    try {
        mostrarLoading(true);
        
        const configuracion = {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (datos) {
            configuracion.body = JSON.stringify(datos);
        }
        
        const respuesta = await fetch(`${URL_SERVIDOR}${endpoint}`, configuracion);
        const resultado = await respuesta.json();
        
        mostrarLoading(false);
        return resultado;
        
    } catch (error) {
        mostrarLoading(false);
        console.error('Error en petición API:', error);
        return { 
            exito: false, 
            mensaje: 'Error de conexión con el servidor' 
        };
    }
}

// Función para manejar el login del repartidor
async function manejarLogin(usuario, clave) {
    const resultado = await hacerPeticion('/login', 'POST', { 
        username: usuario, 
        password: clave 
    });
    
    if (resultado.exito) {
        // Verificar que sea un repartidor
        if (resultado.usuario.tipo === 'repartidor') {
            repartidorActual = resultado.usuario;
            localStorage.setItem('repartidorActual', JSON.stringify(repartidorActual));
            
            mostrarMensaje('mensajeLogin', resultado.mensaje, 'exito');
            
            setTimeout(() => {
                cargarDashboard();
            }, 1500);
        } else {
            mostrarMensaje('mensajeLogin', 'Esta aplicación es solo para repartidores', 'error');
        }
    } else {
        mostrarMensaje('mensajeLogin', resultado.mensaje, 'error');
    }
}

// Función para cargar el dashboard principal
async function cargarDashboard() {
    cambiarPantalla('pantallaDashboard');
    
    // Mostrar información del repartidor
    document.getElementById('nombreRepartidor').textContent = 
        `¡Hola ${repartidorActual.nombre || repartidorActual.nombreUsuario}!`;
    
    // Actualizar estado
    await actualizarEstadoRepartidor();
}

// Función para actualizar el estado del repartidor
async function actualizarEstadoRepartidor() {
    // En esta función podríamos consultar el estado actual del repartidor
    const estadoTexto = document.getElementById('estadoRepartidor');
    estadoTexto.textContent = 'Estado: Disponible 🟢';
}

// Función para cargar órdenes disponibles
async function cargarOrdenesDisponibles() {
    cambiarPantalla('pantallaDisponibles');
    
    const resultado = await hacerPeticion('/orders');
    
    if (resultado.exito) {
        // Filtrar solo órdenes pendientes que no están asignadas a ningún repartidor
        const disponibles = resultado.ordenes.filter(orden => 
            (orden.estadoActual === 'pendiente' || orden.estadoActual === 'aceptado') &&
            !orden.idRepartidor
        );
        
        ordenesDisponibles = disponibles;
        mostrarOrdenesDisponibles(disponibles);
        
    } else {
        mostrarMensaje('mensajeDisponibles', resultado.mensaje, 'error');
    }
}

// Función para mostrar las órdenes disponibles en pantalla
function mostrarOrdenesDisponibles(ordenes) {
    const contenedor = document.getElementById('contenedorDisponibles');
    const sinOrdenes = document.getElementById('sinDisponibles');
    
    if (ordenes.length === 0) {
        contenedor.innerHTML = '';
        sinOrdenes.style.display = 'block';
        return;
    }
    
    sinOrdenes.style.display = 'none';
    contenedor.innerHTML = '';
    
    ordenes.forEach(orden => {
        const tarjetaOrden = document.createElement('div');
        tarjetaOrden.className = 'tarjeta-orden';
        tarjetaOrden.onclick = () => verDetallesOrden(orden, 'disponibles');
        
        const fecha = formatearFecha(orden.fechaCreacion);
        
        tarjetaOrden.innerHTML = `
            <div class="encabezado-orden">
                <span class="numero-orden">Orden #${orden.id}</span>
                <span class="fecha-orden">${fecha}</span>
            </div>
            
            <div class="info-orden">
                <h4>👤 Cliente: ${orden.clienteNombre || orden.nombreCliente || 'Cliente'}</h4>
                <p>🏪 Tienda: ${orden.tiendaNombre || orden.nombreTienda || 'Tienda'}</p>
                <p>📍 Dirección: ${orden.direccionEntrega}</p>
                
                <div class="productos-orden">
                    <h5>🍕 Productos:</h5>
                    ${orden.productosOrdenados.map(producto => 
                        `• ${producto.nombreProducto} x${producto.cantidadSolicitada}`
                    ).join('<br>')}
                </div>
            </div>
            
            <div class="pie-orden">
                <span class="total-orden">$${formatearDinero(orden.montoTotal)}</span>
                <div class="acciones-orden">
                    <button class="boton-aceptar" onclick="event.stopPropagation(); aceptarOrden(${orden.id})">
                        ✅ Aceptar
                    </button>
                    <button class="boton-rechazar" onclick="event.stopPropagation(); rechazarOrden(${orden.id})">
                        ❌ Pasar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(tarjetaOrden);
    });
}

// Función para aceptar una orden
async function aceptarOrden(idOrden) {
    const confirmacion = confirm('¿Estás seguro de que quieres aceptar esta orden?');
    
    if (confirmacion) {
        // Primero actualizamos el estado de la orden a "en camino"
        const resultado = await hacerPeticion(`/orders/${idOrden}`, 'PUT', { 
            estado: 'en_camino' 
        });
        
        if (resultado.exito) {
            mostrarMensaje('mensajeDisponibles', 'Orden aceptada exitosamente. ¡A entregar!', 'exito');
            
            // Recargar la lista de órdenes disponibles
            setTimeout(() => {
                cargarOrdenesDisponibles();
            }, 2000);
            
        } else {
            mostrarMensaje('mensajeDisponibles', resultado.mensaje, 'error');
        }
    }
}

// Función para rechazar una orden
async function rechazarOrden(idOrden) {
    mostrarMensaje('mensajeDisponibles', 'Orden pasada. Verás otras disponibles.', 'info');
}


// Función para cargar mis órdenes asignadas
async function cargarMisOrdenes() {
    cambiarPantalla('pantallaMisOrdenes');
    
    const resultado = await hacerPeticion('/orders');
    
    if (resultado.exito) {
        // Filtrar solo órdenes que están en camino (asignadas a repartidores)
        const miasOrdenes = resultado.ordenes.filter(orden => 
            orden.estadoActual === 'en_camino'
        );
        
        misOrdenes = miasOrdenes;
        mostrarMisOrdenes(miasOrdenes);
        
    } else {
        mostrarMensaje('mensajeMisOrdenes', resultado.mensaje, 'error');
    }
}

// Función para mostrar mis órdenes en pantalla
function mostrarMisOrdenes(ordenes) {
    const contenedor = document.getElementById('contenedorMisOrdenes');
    const sinOrdenes = document.getElementById('sinMisOrdenes');
    
    if (ordenes.length === 0) {
        contenedor.innerHTML = '';
        sinOrdenes.style.display = 'block';
        return;
    }
    
    sinOrdenes.style.display = 'none';
    contenedor.innerHTML = '';
    
    ordenes.forEach(orden => {
        const tarjetaOrden = document.createElement('div');
        tarjetaOrden.className = 'tarjeta-orden';
        tarjetaOrden.onclick = () => verDetallesOrden(orden, 'misordenes');
        
        const fecha = formatearFecha(orden.fechaCreacion);
        
        tarjetaOrden.innerHTML = `
            <div class="encabezado-orden">
                <span class="numero-orden">Orden #${orden.id}</span>
                <span class="fecha-orden">${fecha}</span>
            </div>
            
            <div class="info-orden">
                <h4>👤 Cliente: ${orden.clienteNombre || orden.nombreCliente || 'Cliente'}</h4>
                <p>🏪 Tienda: ${orden.tiendaNombre || orden.nombreTienda || 'Tienda'}</p>
                <p>📍 Dirección: ${orden.direccionEntrega}</p>
                <p>📱 Estado: En camino</p>
                
                <div class="productos-orden">
                    <h5>🍕 Productos:</h5>
                    ${orden.productosOrdenados.map(producto => 
                        `• ${producto.nombreProducto} x${producto.cantidadSolicitada}`
                    ).join('<br>')}
                </div>
            </div>
            
            <div class="pie-orden">
                <span class="total-orden">$${formatearDinero(orden.montoTotal)}</span>
                <div class="acciones-orden">
                    <button class="boton-completar" onclick="event.stopPropagation(); completarOrden(${orden.id})">
                        ✅ Completar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(tarjetaOrden);
    });
}

// Función para completar una orden (marcarla como entregada)
async function completarOrden(idOrden) {
    const confirmacion = confirm('¿Confirmas que la orden fue entregada exitosamente?');
    
    if (confirmacion) {
        const resultado = await hacerPeticion(`/orders/${idOrden}`, 'PUT', { 
            estado: 'entregado' 
        });
        
        if (resultado.exito) {
            mostrarMensaje('mensajeMisOrdenes', '¡Orden completada! Excelente trabajo 🎉', 'exito');
            
            // Recargar mis órdenes después de 2 segundos
            setTimeout(() => {
                cargarMisOrdenes();
            }, 2000);
            
        } else {
            mostrarMensaje('mensajeMisOrdenes', resultado.mensaje, 'error');
        }
    }
}


// Función para ver detalles de una orden específica
function verDetallesOrden(orden, origen) {
    ordenActual = orden;
    cambiarPantalla('pantallaDetalles');
    
    // Llenar los detalles de la orden
    document.getElementById('numeroOrdenDetalle').textContent = `Orden #${orden.id}`;
    
    // Estado de la orden
    const estadoBadge = document.getElementById('estadoOrdenDetalle');
    estadoBadge.textContent = orden.estadoActual.charAt(0).toUpperCase() + orden.estadoActual.slice(1);
    estadoBadge.className = `badge-estado ${orden.estadoActual}`;
    
    // Información del cliente
    document.getElementById('nombreClienteDetalle').textContent = 
        orden.clienteNombre || orden.nombreCliente || 'Cliente';
    document.getElementById('direccionClienteDetalle').textContent = 
        `📍 ${orden.direccionEntrega}`;
    
    // Información de la tienda
    document.getElementById('nombreTiendaDetalle').textContent = 
        orden.tiendaNombre || orden.nombreTienda || 'Tienda';
    
    // Lista de productos
    const listaProductos = document.getElementById('listaProductosDetalle');
    listaProductos.innerHTML = '';
    
    orden.productosOrdenados.forEach(producto => {
        const itemProducto = document.createElement('div');
        itemProducto.style.cssText = `
            padding: 10px;
            background: var(--blanco);
            border-radius: 8px;
            margin-bottom: 10px;
            border: 1px solid rgba(244, 208, 63, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        itemProducto.innerHTML = `
            <span><strong>${producto.nombreProducto}</strong> x${producto.cantidadSolicitada}</span>
            <span>$${formatearDinero(producto.precioUnitario * producto.cantidadSolicitada)}</span>
        `;
        
        listaProductos.appendChild(itemProducto);
    });
    
    // Total
    document.getElementById('totalOrdenDetalle').textContent = formatearDinero(orden.montoTotal);
    
    // Botones de acción según el estado
    const accionesDiv = document.getElementById('accionesDetalle');
    accionesDiv.innerHTML = '';
    
    if (orden.estadoActual === 'pendiente' || orden.estadoActual === 'aceptado') {
        // Si es una orden disponible
        accionesDiv.innerHTML = `
            <button class="boton-aceptar" onclick="aceptarOrdenDetalle(${orden.id})">
                ✅ Aceptar Orden
            </button>
            <button class="boton-rechazar" onclick="volverAtras()">
                ← Volver
            </button>
        `;
    } else if (orden.estadoActual === 'en_camino') {
        // Si es una orden que tengo asignada
        accionesDiv.innerHTML = `
            <button class="boton-completar" onclick="completarOrdenDetalle(${orden.id})">
                ✅ Marcar como Entregada
            </button>
            <button class="boton-secundario" onclick="volverAtras()">
                ← Volver
            </button>
        `;
    } else {
        // Orden ya completada o cancelada
        accionesDiv.innerHTML = `
            <button class="boton-secundario" onclick="volverAtras()">
                ← Volver
            </button>
        `;
    }
    
    // Configurar el botón de volver
    const botonVolver = document.getElementById('volverAtras');
    botonVolver.onclick = () => {
        if (origen === 'disponibles') {
            cambiarPantalla('pantallaDisponibles');
        } else if (origen === 'misordenes') {
            cambiarPantalla('pantallaMisOrdenes');
        } else {
            cambiarPantalla('pantallaDashboard');
        }
    };
}

// Función para aceptar orden desde detalles
async function aceptarOrdenDetalle(idOrden) {
    await aceptarOrden(idOrden);
    cambiarPantalla('pantallaDisponibles');
}

// Función para completar orden desde detalles
async function completarOrdenDetalle(idOrden) {
    await completarOrden(idOrden);
    cambiarPantalla('pantallaMisOrdenes');
}

// Función para volver atrás
function volverAtras() {
    cambiarPantalla('pantallaDashboard');
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un repartidor logueado guardado
    const repartidorGuardado = localStorage.getItem('repartidorActual');
    if (repartidorGuardado) {
        repartidorActual = JSON.parse(repartidorGuardado);
        cargarDashboard();
    }
    
    const formularioLogin = document.getElementById('formularioLogin');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = document.getElementById('usuario').value;
            const clave = document.getElementById('clave').value;
            
            if (!usuario || !clave) {
                mostrarMensaje('mensajeLogin', 'Por favor llena todos los campos', 'error');
                return;
            }
            
            manejarLogin(usuario, clave);
        });
    }
    
    const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', function() {
            const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
            
            if (confirmacion) {
                repartidorActual = null;
                localStorage.removeItem('repartidorActual');
                cambiarPantalla('pantallaLogin');
                document.getElementById('formularioLogin').reset();
            }
        });
    }
    
    const botonVerDisponibles = document.getElementById('botonVerDisponibles');
    if (botonVerDisponibles) {
        botonVerDisponibles.addEventListener('click', function() {
            cargarOrdenesDisponibles();
        });
    }
    
    const botonMisOrdenes = document.getElementById('botonMisOrdenes');
    if (botonMisOrdenes) {
        botonMisOrdenes.addEventListener('click', function() {
            cargarMisOrdenes();
        });
    }
    
    const botonCambiarEstado = document.getElementById('botonCambiarEstado');
    if (botonCambiarEstado) {
        botonCambiarEstado.addEventListener('click', function() {
            const estadoActual = document.getElementById('estadoRepartidor').textContent;
            
            if (estadoActual.includes('Disponible')) {
                document.getElementById('estadoRepartidor').textContent = 'Estado: Ocupado 🔴';
                mostrarMensaje('mensajeDashboard', 'Estado cambiado a Ocupado', 'info');
            } else {
                document.getElementById('estadoRepartidor').textContent = 'Estado: Disponible 🟢';
                mostrarMensaje('mensajeDashboard', 'Estado cambiado a Disponible', 'exito');
            }
        });
    }
    
    const volverDashboard1 = document.getElementById('volverDashboard1');
    if (volverDashboard1) {
        volverDashboard1.addEventListener('click', function() {
            cambiarPantalla('pantallaDashboard');
        });
    }
    
    const volverDashboard2 = document.getElementById('volverDashboard2');
    if (volverDashboard2) {
        volverDashboard2.addEventListener('click', function() {
            cambiarPantalla('pantallaDashboard');
        });
    }
    
    const actualizarDisponibles = document.getElementById('actualizarDisponibles');
    if (actualizarDisponibles) {
        actualizarDisponibles.addEventListener('click', function() {
            cargarOrdenesDisponibles();
        });
    }
    
    const actualizarMisOrdenes = document.getElementById('actualizarMisOrdenes');
    if (actualizarMisOrdenes) {
        actualizarMisOrdenes.addEventListener('click', function() {
            cargarMisOrdenes();
        });
    }
});

// Estas funciones deben estar en el scope global para que funcionen los botones creados dinámicamente
window.aceptarOrden = aceptarOrden;
window.rechazarOrden = rechazarOrden;
window.completarOrden = completarOrden;
window.verDetallesOrden = verDetallesOrden;
window.aceptarOrdenDetalle = aceptarOrdenDetalle;
window.completarOrdenDetalle = completarOrdenDetalle;
window.volverAtras = volverAtras;