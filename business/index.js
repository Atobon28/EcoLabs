
// VARIABLES GLOBALES información importante
const URL_SERVIDOR = 'http://localhost:5050'; // Dirección de servidor
let tiendaActual = null; // Información de la tienda que está logueada
let ordenesActuales = []; // Lista de órdenes que la tienda tiene pendientes

// Función para mostrar mensajes al usuario
function mostrarMensaje(elementId, mensaje, tipo = 'info') {
    console.log("Mostrando mensaje:", mensaje, "Tipo:", tipo);
    const elementoMensaje = document.getElementById(elementId);
    
    if (!elementoMensaje) {
        console.error("No se encontró el elemento:", elementId);
        return;
    }
    
    elementoMensaje.textContent = mensaje;
    elementoMensaje.className = `mensaje ${tipo}`;
    elementoMensaje.style.display = 'block';
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        elementoMensaje.style.display = 'none';
    }, 5000);
}

// Función para mostrar u ocultar el loading
function mostrarLoading(mostrar = true) {
    const overlay = document.getElementById('overlayLoading');
    overlay.style.display = mostrar ? 'flex' : 'none';
}

// Función para cambiar entre pantallas
function cambiarPantalla(pantallaId) {
    // Ocultar todas las pantallas
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(pantalla => pantalla.classList.remove('activa'));
    
    // Mostrar la pantalla que queremos
    document.getElementById(pantallaId).classList.add('activa');
}

// Función para formatear números como dinero colombiano
function formatearDinero(cantidad) {
    return new Intl.NumberFormat('es-CO').format(cantidad);
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
        
        // Si enviamos datos, los agregamos al body
        if (datos) {
            configuracion.body = JSON.stringify(datos);
        }
        
        const respuesta = await fetch(`${URL_SERVIDOR}${endpoint}`, configuracion);
        const resultado = await respuesta.json();
        
        mostrarLoading(false);
        return resultado;
        
    } catch (error) {
        mostrarLoading(false);
        console.error('Error en petición:', error);
        return { 
            exito: false, 
            mensaje: 'Error de conexión con el servidor' 
        };
    }
}

// Función para manejar el login de la tienda
async function manejarLogin(usuario, clave) {
    console.log("Intentando login con usuario:", usuario);
    mostrarMensaje('mensajeLogin', 'Conectando con el servidor...', 'info');
    
    try {
        const resultado = await hacerPeticion('/login-store', 'POST', { 
            username: usuario, 
            password: clave 
        });
        
        console.log("Respuesta del servidor:", resultado);
        
        if (resultado.exito) {
            // Guardar información de la tienda
            tiendaActual = resultado.tienda;
            console.log("Tienda logueada:", tiendaActual);
            
            // Mostrar mensaje de éxito
            mostrarMensaje('mensajeLogin', resultado.mensaje, 'exito');
            
            // Cargar el dashboard después de 1.5 segundos
            setTimeout(() => {
                cargarDashboard();
            }, 1500);
            
        } else {
            // Mostrar mensaje de error
            mostrarMensaje('mensajeLogin', resultado.mensaje || 'Error de login', 'error');
        }
        
    } catch (error) {
        console.error("Error en login:", error);
        mostrarMensaje('mensajeLogin', 'Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    }
}


// Función para cargar el dashboard principal
async function cargarDashboard() {
    // Cambiar a la pantalla del dashboard
    cambiarPantalla('dashboardScreen');
    
    // Mostrar información de la tienda
    document.getElementById('nombreTienda').textContent = tiendaActual.nombreNegocio;
    document.getElementById('descripcionTienda').textContent = 'Dashboard de administración';
    
    // Cargar el estado actual de la tienda
    await verificarEstadoTienda();
}

// Función para verificar si la tienda está abierta o cerrada
async function verificarEstadoTienda() {
    const resultado = await hacerPeticion('/stores');
    
    if (resultado.exito) {
        // Buscar nuestra tienda en la lista
        const miTienda = resultado.tiendas.find(t => t.id === tiendaActual.id);
        
        if (miTienda) {
            // Actualizar el botón y texto según el estado
            const estadoTexto = document.getElementById('estadoTienda');
            const botonAbrirCerrar = document.getElementById('botonAbrirCerrar');
            
            if (miTienda.activa) {
                estadoTexto.textContent = 'Estado: Abierta 🟢';
                estadoTexto.style.background = 'rgba(244, 208, 63, 0.3)';
                botonAbrirCerrar.textContent = 'Cerrar Tienda';
                botonAbrirCerrar.onclick = () => cambiarEstadoTienda('close');
            } else {
                estadoTexto.textContent = 'Estado: Cerrada 🔴';
                estadoTexto.style.background = 'rgba(125, 25, 53, 0.3)';
                botonAbrirCerrar.textContent = 'Abrir Tienda';
                botonAbrirCerrar.onclick = () => cambiarEstadoTienda('open');
            }
        }
    }
}

// Función para cambiar el estado de la tienda (abrir/cerrar)
async function cambiarEstadoTienda(accion) {
    const resultado = await hacerPeticion(`/activate-store/${tiendaActual.id}`, 'PUT', { 
        action: accion 
    });
    
    if (resultado.exito) {
        mostrarMensaje('mensajeDashboard', resultado.mensaje, 'exito');
        // Actualizar el estado en pantalla
        await verificarEstadoTienda();
    } else {
        mostrarMensaje('mensajeDashboard', resultado.mensaje, 'error');
    }
}

// FUNCIONES PARA ÓRDENES

// Función para cargar y mostrar las órdenes pendientes
async function cargarOrdenes() {
    cambiarPantalla('ordenesScreen');
    
    const resultado = await hacerPeticion('/orders');
    
    if (resultado.exito) {
        // Filtrar solo las órdenes de nuestra tienda que están pendientes
        const ordenesDeMiTienda = resultado.ordenes.filter(orden => 
            orden.idTienda === tiendaActual.id && 
            (orden.estadoActual === 'pendiente' || orden.estadoActual === 'esperando_confirmacion')
        );
        
        ordenesActuales = ordenesDeMiTienda;
        mostrarOrdenes(ordenesDeMiTienda);
        
    } else {
        mostrarMensaje('mensajeOrdenes', resultado.mensaje, 'error');
    }
}

// Función para mostrar las órdenes en pantalla
function mostrarOrdenes(ordenes) {
    const contenedor = document.getElementById('contenedorOrdenes');
    const sinOrdenes = document.getElementById('sinOrdenes');
    
    // Si no hay órdenes, mostrar mensaje
    if (ordenes.length === 0) {
        contenedor.innerHTML = '';
        sinOrdenes.style.display = 'block';
        return;
    }
    
    // Ocultar mensaje de "sin órdenes"
    sinOrdenes.style.display = 'none';
    
    // Crear HTML para cada orden
    contenedor.innerHTML = '';
    
    ordenes.forEach(orden => {
        const fecha = new Date(orden.fechaCreacion).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const tarjetaOrden = document.createElement('div');
        tarjetaOrden.className = 'tarjeta-orden';
        
        tarjetaOrden.innerHTML = `
            <div class="encabezado-orden">
                <span class="numero-orden">Pedido #${orden.id}</span>
                <span class="fecha-orden">${fecha}</span>
            </div>
            
            <div class="detalles-orden">
                <h4>Cliente: ${orden.clienteNombre || orden.nombreCliente}</h4>
                <div class="productos-orden">
                    Productos: ${orden.productosOrdenados.map(p => 
                        `${p.nombreProducto} x${p.cantidadSolicitada}`
                    ).join(', ')}
                </div>
                <div class="direccion-orden">
                    📍 Entregar en: ${orden.direccionEntrega}
                </div>
            </div>
            
            <div class="pie-orden">
                <span class="total-orden">${formatearDinero(orden.montoTotal)}</span>
                <div class="acciones-orden">
                    <button class="boton-aceptar" onclick="aceptarOrden(${orden.id})">
                        ✅ Aceptar
                    </button>
                    <button class="boton-rechazar" onclick="rechazarOrden(${orden.id})">
                        ❌ Rechazar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(tarjetaOrden);
    });
}

// Función para aceptar una orden
async function aceptarOrden(idOrden) {
    const confirmacion = confirm('¿Estás seguro de que quieres aceptar este pedido?');
    
    if (confirmacion) {
        const resultado = await hacerPeticion(`/orders/${idOrden}`, 'PUT', { 
            estado: 'aceptado' 
        });
        
        if (resultado.exito) {
            mostrarMensaje('mensajeOrdenes', 'Pedido aceptado exitosamente', 'exito');
            // Recargar la lista de órdenes
            await cargarOrdenes();
        } else {
            mostrarMensaje('mensajeOrdenes', resultado.mensaje, 'error');
        }
    }
}

// Función para rechazar una orden
async function rechazarOrden(idOrden) {
    const confirmacion = confirm('¿Estás seguro de que quieres rechazar este pedido?');
    
    if (confirmacion) {
        const resultado = await hacerPeticion(`/orders/${idOrden}`, 'PUT', { 
            estado: 'cancelado' 
        });
        
        if (resultado.exito) {
            mostrarMensaje('mensajeOrdenes', 'Pedido rechazado', 'info');
            // Recargar la lista de órdenes
            await cargarOrdenes();
        } else {
            mostrarMensaje('mensajeOrdenes', resultado.mensaje, 'error');
        }
    }
}


// Función para manejar la creación de un nuevo producto
async function crearProducto(datosProducto) {
    const resultado = await hacerPeticion('/products', 'POST', {
        nombre: datosProducto.nombre,
        descripcion: datosProducto.descripcion,
        precio: parseFloat(datosProducto.precio),
        tienda: tiendaActual.nombreNegocio,
        categoria: datosProducto.categoria,
        imagen: datosProducto.imagen || 'https://via.placeholder.com/400x300/F4D03F/7D1935?text=Producto',
        tiempo_preparacion: datosProducto.tiempoPreparacion
    });
    
    if (resultado.exito) {
        mostrarMensaje('mensajeProducto', 'Producto creado exitosamente', 'exito');
        
        // Limpiar el formulario
        document.getElementById('formProducto').reset();
        
        // Volver al dashboard después de 2 segundos
        setTimeout(() => {
            cambiarPantalla('dashboardScreen');
        }, 2000);
        
    } else {
        mostrarMensaje('mensajeProducto', resultado.mensaje, 'error');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, configurando eventos...");
    
    // EVENTOS DEL FORMULARIO DE LOGIN
    const formLogin = document.getElementById('formLogin');
    
    if (!formLogin) {
        console.error("No se encontró el formulario de login");
        return;
    }
    
    formLogin.addEventListener('submit', function(e) {
        console.log("Formulario de login enviado");
        e.preventDefault(); // Evitar que se recargue la página
        
        const usuario = document.getElementById('usuario').value;
        const clave = document.getElementById('clave').value;
        
        console.log("Datos del formulario - Usuario:", usuario, "Clave:", clave ? "[OCULTA]" : "[VACÍA]");
        
        // Validar que se hayan llenado los campos
        if (!usuario || !clave) {
            console.log("Campos vacíos detectados");
            mostrarMensaje('mensajeLogin', 'Por favor llena todos los campos', 'error');
            return;
        }
        
        // Intentar hacer login
        console.log("Llamando a manejarLogin...");
        manejarLogin(usuario, clave);
    });
    
    console.log("Evento de login configurado correctamente");
    
    // EVENTOS DEL DASHBOARD
    const botonCerrarSesion = document.getElementById('botonCerrarSesion');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', function() {
            const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
            
            if (confirmacion) {
                // Limpiar información de la tienda
                tiendaActual = null;
                ordenesActuales = [];
                
                // Volver a la pantalla de login
                cambiarPantalla('loginScreen');
                
                // Limpiar el formulario de login
                document.getElementById('formLogin').reset();
            }
        });
    }
    
    const botonVerOrdenes = document.getElementById('botonVerOrdenes');
    if (botonVerOrdenes) {
        botonVerOrdenes.addEventListener('click', function() {
            cargarOrdenes();
        });
    }
    
    const botonAgregarProducto = document.getElementById('botonAgregarProducto');
    if (botonAgregarProducto) {
        botonAgregarProducto.addEventListener('click', function() {
            cambiarPantalla('productoScreen');
        });
    }
    
    // EVENTOS DE NAVEGACIÓN
    const volverDashboard1 = document.getElementById('volverDashboard1');
    if (volverDashboard1) {
        volverDashboard1.addEventListener('click', function() {
            cambiarPantalla('dashboardScreen');
        });
    }
    
    const volverDashboard2 = document.getElementById('volverDashboard2');
    if (volverDashboard2) {
        volverDashboard2.addEventListener('click', function() {
            cambiarPantalla('dashboardScreen');
        });
    }
    
    const actualizarOrdenes = document.getElementById('actualizarOrdenes');
    if (actualizarOrdenes) {
        actualizarOrdenes.addEventListener('click', function() {
            cargarOrdenes();
        });
    }
    
    // EVENTOS DEL FORMULARIO DE PRODUCTO
    const formProducto = document.getElementById('formProducto');
    if (formProducto) {
        formProducto.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitar que se recargue la página
            
            // Obtener todos los datos del formulario
            const datosProducto = {
                nombre: document.getElementById('nombreProducto').value,
                descripcion: document.getElementById('descripcionProducto').value,
                precio: document.getElementById('precioProducto').value,
                categoria: document.getElementById('categoriaProducto').value,
                imagen: document.getElementById('imagenProducto').value,
                tiempoPreparacion: document.getElementById('tiempoPreparacion').value
            };
            
            // Validar que se hayan llenado los campos obligatorios
            if (!datosProducto.nombre || !datosProducto.descripcion || !datosProducto.precio || !datosProducto.categoria) {
                mostrarMensaje('mensajeProducto', 'Por favor llena todos los campos obligatorios', 'error');
                return;
            }
            
            // Validar que el precio sea un número válido
            if (isNaN(datosProducto.precio) || parseFloat(datosProducto.precio) <= 0) {
                mostrarMensaje('mensajeProducto', 'Por favor ingresa un precio válido', 'error');
                return;
            }
            
            // Intentar crear el producto
            crearProducto(datosProducto);
        });
    }
    
    console.log("Todos los eventos configurados correctamente");
});

// FUNCIONES GLOBALES - Para que funcionen los botones de aceptar/rechazar órdenes
window.aceptarOrden = aceptarOrden;
window.rechazarOrden = rechazarOrden;