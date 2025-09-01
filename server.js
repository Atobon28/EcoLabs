// TOBONSITA RAPPI - SERVIDOR BACKEND


// Importar dependencias necesarias
const express = require('express');
const cors = require('cors');
const path = require('path');

// Crear la aplicación Express
const app = express();
const PUERTO = 5050;

// CONFIGURACIÓN DE MIDDLEWARES
// Middleware para permitir peticiones desde cualquier origen (CORS)
app.use(cors());
// Middleware para parsear JSON en las peticiones
app.use(express.json());
// Servir archivos estáticos desde diferentes carpetas
app.use('/consumer', express.static(path.join(__dirname, 'consumer')));
app.use('/business', express.static(path.join(__dirname, 'business')));
app.use('/courier', express.static(path.join(__dirname, 'courier')));
app.use('/', express.static(path.join(__dirname, 'public')));

// BASE DE DATOS EN MEMORIA (ARRAYS)

// Array para almacenar los clientes registrados
let clientesRegistrados = [
    {
        id: 100,
        nombreUsuario: 'cliente_demo',
        clave: 'demo123',
        nombreCompleto: 'María González',
        correo: 'maria@correo.com',
        celular: '3101234567',
        fechaRegistro: new Date()
    }
];

// Array para almacenar las tiendas del sistema
let tiendasDisponibles = [
    {
        id: 200,
        nombreUsuario: 'pizzas_mario',
        clave: 'mario123',
        nombreNegocio: 'Pizzas de Mario',
        descripcionNegocio: 'Auténticas pizzas italianas hechas en horno de leña',
        tipoComida: 'Italiana',
        direccionCompleta: 'Carrera 15 #85-42, Zona Rosa',
        numeroTelefono: '3201234567',
        horarioAtencion: '11:00 AM - 11:00 PM',
        calificacionPromedio: 4.8,
        tiempoEntregaEstimado: '25-35 minutos',
        estaActiva: true
    },
    {
        id: 201,
        nombreUsuario: 'hambur_express',
        clave: 'burger456',
        nombreNegocio: 'Hamburguesas Express',
        descripcionNegocio: 'Hamburguesas gourmet con ingredientes frescos',
        tipoComida: 'Comida Rápida',
        direccionCompleta: 'Calle 72 #11-30, Chapinero',
        numeroTelefono: '3109876543',
        horarioAtencion: '12:00 PM - 12:00 AM',
        calificacionPromedio: 4.5,
        tiempoEntregaEstimado: '20-30 minutos',
        estaActiva: false
    }
];

// Array para almacenar los repartidores
let repartidoresActivos = [
    {
        id: 300,
        nombreUsuario: 'delivery_juan',
        clave: 'juan789',
        nombreCompleto: 'Juan Carlos Ramírez',
        celular: '3151234567',
        estaDisponible: true,
        vehiculo: 'Motocicleta',
        calificacion: 4.9
    }
];

// Array para almacenar el menú de productos
let menuProductos = [
    {
        id: 400,
        idTienda: 200,
        nombreProducto: 'Pizza Napolitana',
        descripcionDetallada: 'Pizza artesanal con tomate San Marzano, mozzarella di bufala y albahaca fresca',
        precioVenta: 32000,
        imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop',
        categoriaProducto: 'Pizza Clásica',
        estaDisponible: true,
        tiempoCoccion: '12-15 minutos'
    },
    {
        id: 401,
        idTienda: 200,
        nombreProducto: 'Pizza Quattro Formaggi',
        descripcionDetallada: 'Deliciosa combinación de cuatro quesos: mozzarella, parmesano, gorgonzola y ricotta',
        precioVenta: 36000,
        imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop',
        categoriaProducto: 'Pizza Especial',
        estaDisponible: true,
        tiempoCoccion: '15-18 minutos'
    },
    {
        id: 402,
        idTienda: 201,
        nombreProducto: 'Hamburguesa Clásica',
        descripcionDetallada: 'Carne 100% res, lechuga, tomate, cebolla y salsa especial en pan artesanal',
        precioVenta: 24000,
        imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
        categoriaProducto: 'Hamburguesa Tradicional',
        estaDisponible: true,
        tiempoCoccion: '8-10 minutos'
    }
];

// Array para almacenar las órdenes realizadas
let ordenesRealizadas = [
    {
        id: 500,
        idCliente: 100,
        idTienda: 200,
        idRepartidor: null,
        productosOrdenados: [
            {
                idProducto: 400,
                cantidadSolicitada: 1,
                precioUnitario: 32000,
                nombreProducto: 'Pizza Napolitana'
            }
        ],
        montoTotal: 32000,
        estadoActual: 'esperando_confirmacion',
        direccionEntrega: 'Calle 85 #14-23, Apartamento 402',
        fechaCreacion: new Date(),
        tiempoEstimadoEntrega: '35-45 minutos',
        notasEspeciales: 'Sin cebolla por favor'
    }
];

// CONTADORES PARA GENERAR IDs ÚNICOS
// Variables que nos ayudan a generar IDs únicos para nuevos registros
let siguienteIdCliente = Math.max(...clientesRegistrados.map(c => c.id), 0) + 1;
let siguienteIdTienda = Math.max(...tiendasDisponibles.map(t => t.id), 0) + 1;
let siguienteIdRepartidor = Math.max(...repartidoresActivos.map(r => r.id), 0) + 1;
let siguienteIdProducto = Math.max(...menuProductos.map(p => p.id), 0) + 1;
let siguienteIdOrden = Math.max(...ordenesRealizadas.map(o => o.id), 0) + 1;

// FUNCIONES DE UTILIDAD

// Buscar un cliente por su nombre de usuario
const encontrarClientePorUsuario = (nombreUsuario) => {
    return clientesRegistrados.find(cliente => cliente.nombreUsuario === nombreUsuario);
};

// Buscar una tienda por su ID
const encontrarTiendaPorId = (idTienda) => {
    return tiendasDisponibles.find(tienda => tienda.id === parseInt(idTienda));
};

// Buscar una tienda por su nombre de usuario
const encontrarTiendaPorUsuario = (nombreUsuario) => {
    return tiendasDisponibles.find(tienda => tienda.nombreUsuario === nombreUsuario);
};

// Obtener todos los productos de una tienda específica
const obtenerProductosDeTienda = (idTienda) => {
    return menuProductos.filter(producto => 
        producto.idTienda === parseInt(idTienda) && producto.estaDisponible
    );
};

// Buscar un repartidor por su nombre de usuario
const encontrarRepartidorPorUsuario = (nombreUsuario) => {
    return repartidoresActivos.find(repartidor => repartidor.nombreUsuario === nombreUsuario);
};

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    // Esta ruta muestra información básica sobre nuestro servidor
    res.json({
        mensaje: '🍕 ¡Bienvenido a Tobonsita Rappi - Tu app de delivery favorita! 🚗',
        version: '2.0.0',
        desarrollado_por: 'Ana Sofia Tobon - A00405079',
        estado: 'Servidor funcionando correctamente',
        endpoints_disponibles: {
            autenticacion: {
                'POST /login': 'Iniciar sesión para clientes y repartidores',
                'POST /login-store': 'Iniciar sesión para tiendas'
            },
            tiendas: {
                'GET /stores': 'Ver todas las tiendas disponibles',
                'GET /restaurant/:id/menu': 'Ver menú de una tienda específica',
                'PUT /activate-store/:id': 'Activar o desactivar una tienda'
            },
            productos: {
                'POST /products': 'Agregar nuevo producto al menú',
                'GET /productos': 'Ver todos los productos disponibles'
            },
            ordenes: {
                'POST /orders': 'Crear una nueva orden',
                'GET /orders': 'Ver todas las órdenes',
                'PUT /orders/:id': 'Actualizar el estado de una orden'
            },
            estadisticas: {
                'GET /stats': 'Ver estadísticas generales del sistema'
            }
        }
    });
});

// ENDPOINTS DE AUTENTICACIÓN

// POST /login - Iniciar sesión para clientes y repartidores
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que se hayan enviado todos los datos necesarios
        if (!username || !password) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Por favor proporciona nombre de usuario y contraseña'
            });
        }

        // Buscar si el usuario existe como cliente
        let usuarioEncontrado = encontrarClientePorUsuario(username);
        let tipoUsuario = 'cliente';

        // Si no es cliente, buscar si es repartidor
        if (!usuarioEncontrado) {
            usuarioEncontrado = encontrarRepartidorPorUsuario(username);
            tipoUsuario = 'repartidor';
        }

        // Si el usuario no existe en ninguna categoría, crear uno nuevo como cliente
        if (!usuarioEncontrado) {
            const nuevoCliente = {
                id: siguienteIdCliente++,
                nombreUsuario: username,
                clave: password,
                nombreCompleto: `Usuario ${username}`,
                correo: `${username}@tobonsitarappi.com`,
                celular: '300000000',
                fechaRegistro: new Date()
            };
            
            clientesRegistrados.push(nuevoCliente);
            
            return res.status(201).json({
                exito: true,
                mensaje: '¡Cuenta creada exitosamente! Ya puedes empezar a pedir',
                usuario: {
                    id: nuevoCliente.id,
                    nombreUsuario: nuevoCliente.nombreUsuario,
                    nombre: nuevoCliente.nombreCompleto,
                    tipo: 'cliente'
                }
            });
        }

        // Verificar que la contraseña sea correcta
        if (usuarioEncontrado.clave !== password) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Contraseña incorrecta. Por favor verifica tus datos'
            });
        }

        // Login exitoso
        res.status(200).json({
            exito: true,
            mensaje: `¡Bienvenido de nuevo! Has iniciado sesión como ${tipoUsuario}`,
            usuario: {
                id: usuarioEncontrado.id,
                nombreUsuario: usuarioEncontrado.nombreUsuario,
                nombre: usuarioEncontrado.nombreCompleto,
                tipo: tipoUsuario
            }
        });

    } catch (error) {
        // Manejo de errores inesperados
        console.error('Error en login:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Ocurrió un error interno. Por favor intenta de nuevo',
            detalleError: error.message
        });
    }
});

// POST /login-store - Iniciar sesión específico para tiendas
app.post('/login-store', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validación de campos obligatorios
        if (!username || !password) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Nombre de usuario y contraseña son obligatorios'
            });
        }

        // Buscar la tienda por nombre de usuario
        const tiendaEncontrada = encontrarTiendaPorUsuario(username);

        if (!tiendaEncontrada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No encontramos una tienda con ese nombre de usuario'
            });
        }

        // Verificar contraseña
        if (tiendaEncontrada.clave !== password) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Contraseña incorrecta para esta tienda'
            });
        }

        // Login de tienda exitoso
        res.status(200).json({
            exito: true,
            mensaje: `¡Bienvenido ${tiendaEncontrada.nombreNegocio}!`,
            tienda: {
                id: tiendaEncontrada.id,
                nombreUsuario: tiendaEncontrada.nombreUsuario,
                nombreNegocio: tiendaEncontrada.nombreNegocio,
                tipo: 'tienda'
            }
        });

    } catch (error) {
        console.error('Error en login de tienda:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error del servidor al procesar el login',
            detalleError: error.message
        });
    }
});

// ENDPOINTS DE TIENDAS

// GET /stores - Obtener lista de todas las tiendas
app.get('/stores', (req, res) => {
    try {
        // Crear una versión publica de la información de tiendas
        const tiendasPublicas = tiendasDisponibles.map(tienda => ({
            id: tienda.id,
            nombre: tienda.nombreNegocio,
            descripcion: tienda.descripcionNegocio,
            tipo: tienda.tipoComida,
            direccion: tienda.direccionCompleta,
            horario: tienda.horarioAtencion,
            calificacion: tienda.calificacionPromedio,
            tiempoEntrega: tienda.tiempoEntregaEstimado,
            activa: tienda.estaActiva,
            imagen: `https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=${encodeURIComponent(tienda.nombreNegocio)}`
        }));

        res.status(200).json({
            exito: true,
            mensaje: 'Lista de tiendas obtenida correctamente',
            tiendas: tiendasPublicas,
            totalTiendas: tiendasPublicas.length,
            tiendasActivas: tiendasPublicas.filter(t => t.activa).length
        });

    } catch (error) {
        console.error('Error al obtener tiendas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al cargar la lista de tiendas',
            detalleError: error.message
        });
    }
});

// Obtener menú de una tienda específica
app.get('/restaurant/:id/menu', (req, res) => {
    try {
        const idTienda = parseInt(req.params.id);
        
        // Buscar la tienda
        const tiendaEncontrada = encontrarTiendaPorId(idTienda);

        if (!tiendaEncontrada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No encontramos la tienda solicitada'
            });
        }

        // Obtener productos de la tienda
        const productosMenu = obtenerProductosDeTienda(idTienda);

        res.status(200).json({
            exito: true,
            mensaje: `Menú de ${tiendaEncontrada.nombreNegocio} cargado exitosamente`,
            informacionTienda: {
                id: tiendaEncontrada.id,
                nombre: tiendaEncontrada.nombreNegocio,
                descripcion: tiendaEncontrada.descripcionNegocio,
                direccion: tiendaEncontrada.direccionCompleta,
                horario: tiendaEncontrada.horarioAtencion,
                calificacion: tiendaEncontrada.calificacionPromedio,
                tiempoEntrega: tiendaEncontrada.tiempoEntregaEstimado,
                activa: tiendaEncontrada.estaActiva
            },
            menu: productosMenu,
            totalProductos: productosMenu.length
        });

    } catch (error) {
        console.error('Error al obtener menú:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al cargar el menú de la tienda',
            detalleError: error.message
        });
    }
});

// Activar o desactivar una tienda
app.put('/activate-store/:id', (req, res) => {
    try {
        const idTienda = parseInt(req.params.id);
        const { action } = req.body;

        // Buscar la tienda
        const tiendaEncontrada = encontrarTiendaPorId(idTienda);

        if (!tiendaEncontrada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Tienda no encontrada en el sistema'
            });
        }

        // Cambiar el estado según la acción solicitada
        let nuevoEstado;
        if (action === 'open') {
            nuevoEstado = true;
        } else if (action === 'close') {
            nuevoEstado = false;
        } else {
            // Si no se especifica acción, alternar el estado actual
            nuevoEstado = !tiendaEncontrada.estaActiva;
        }

        tiendaEncontrada.estaActiva = nuevoEstado;

        res.status(200).json({
            exito: true,
            mensaje: `Tienda ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
            tienda: {
                id: tiendaEncontrada.id,
                nombre: tiendaEncontrada.nombreNegocio,
                activa: tiendaEncontrada.estaActiva
            }
        });

    } catch (error) {
        console.error('Error al cambiar estado de tienda:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el estado de la tienda',
            detalleError: error.message
        });
    }
});

// ENDPOINTS DE PRODUCTOS

// Agregar nuevo producto al menú
app.post('/products', (req, res) => {
    try {
        const { 
            id, 
            nombre, 
            precio, 
            tienda, 
            categoria, 
            descripcion, 
            imagen,
            tiempo_preparacion 
        } = req.body;

        if (!nombre || !precio || !tienda) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Nombre, precio y tienda son campos obligatorios'
            });
        }

        // Verificar si ya existe un producto con ese ID
        if (id && menuProductos.find(p => p.id === id)) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un producto con ese ID'
            });
        }

        // Buscar la tienda por nombre para obtener su ID
        const tiendaEncontrada = tiendasDisponibles.find(t => t.nombreNegocio === tienda);
        let idTiendaReal;

        if (tiendaEncontrada) {
            idTiendaReal = tiendaEncontrada.id;
        } else {
            // Si no existe la tienda por nombre, asumir que 'tienda' es el nombre genérico
            idTiendaReal = 999; // ID genérico para tiendas no registradas
        }

        // Crear el nuevo producto
        const nuevoProducto = {
            id: id || siguienteIdProducto++,
            idTienda: idTiendaReal,
            nombreProducto: nombre,
            descripcionDetallada: descripcion || 'Descripción no disponible',
            precioVenta: parseFloat(precio),
            imagenUrl: imagen || 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Producto',
            categoriaProducto: categoria || 'General',
            estaDisponible: true,
            tiempoCoccion: tiempo_preparacion || '15-20 minutos',
            tiendaNombre: tienda
        };

        // Agregar el producto a la lista
        menuProductos.push(nuevoProducto);

        res.status(201).json({
            exito: true,
            mensaje: 'Producto agregado al menú exitosamente',
            producto: nuevoProducto
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al agregar el producto al menú',
            detalleError: error.message
        });
    }
});

// Obtener todos los productos disponibles
app.get('/productos', (req, res) => {
    try {
        res.status(200).json({
            exito: true,
            mensaje: 'Lista de productos obtenida correctamente',
            productos: menuProductos.filter(p => p.estaDisponible),
            totalProductos: menuProductos.length
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al cargar la lista de productos',
            detalleError: error.message
        });
    }
});

// ENDPOINTS DE ÓRDENES

// Crear una nueva orden de delivery
app.post('/orders', (req, res) => {
    try {
        const { id, producto, cliente, tienda, direccion, total } = req.body;

        // Validar campos esenciales
        if (!producto || !cliente) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Producto y cliente son campos obligatorios'
            });
        }

        // Verificar si ya existe una orden con ese ID
        if (id && ordenesRealizadas.find(o => o.id === id)) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe una orden con ese ID'
            });
        }

        // Buscar información del cliente
        const clienteEncontrado = encontrarClientePorUsuario(cliente);
        let idClienteReal = clienteEncontrado ? clienteEncontrado.id : 999;

        // Buscar información de la tienda
        const tiendaEncontrada = tiendasDisponibles.find(t => t.nombreNegocio === tienda);
        let idTiendaReal = tiendaEncontrada ? tiendaEncontrada.id : 999;

        // Buscar información del producto
        const productoEncontrado = menuProductos.find(p => p.nombreProducto === producto);
        let precioProducto = productoEncontrado ? productoEncontrado.precioVenta : (total || 0);

        // Crear la nueva orden
        const nuevaOrden = {
            id: id || siguienteIdOrden++,
            idCliente: idClienteReal,
            idTienda: idTiendaReal,
            idRepartidor: null,
            productosOrdenados: [{
                idProducto: productoEncontrado ? productoEncontrado.id : 999,
                cantidadSolicitada: 1,
                precioUnitario: precioProducto,
                nombreProducto: producto
            }],
            montoTotal: total || precioProducto,
            estadoActual: 'pendiente',
            direccionEntrega: direccion || 'Dirección no especificada',
            fechaCreacion: new Date(),
            tiempoEstimadoEntrega: '30-45 minutos',
            nombreCliente: cliente,
            nombreTienda: tienda || 'Tienda General'
        };

        // Agregar la orden a la lista
        ordenesRealizadas.push(nuevaOrden);

        res.status(201).json({
            exito: true,
            mensaje: 'Orden creada exitosamente. ¡Pronto recibirás tu pedido!',
            orden: {
                id: nuevaOrden.id,
                total: nuevaOrden.montoTotal,
                estado: nuevaOrden.estadoActual,
                tiempoEstimado: nuevaOrden.tiempoEstimadoEntrega
            }
        });

    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al procesar la orden',
            detalleError: error.message
        });
    }
});

// Obtener lista de todas las órdenes
app.get('/orders', (req, res) => {
    try {
        const ordenesCompletas = ordenesRealizadas.map(orden => {
            const clienteInfo = clientesRegistrados.find(c => c.id === orden.idCliente);
            const tiendaInfo = tiendasDisponibles.find(t => t.id === orden.idTienda);
            const repartidorInfo = repartidoresActivos.find(r => r.id === orden.idRepartidor);

            return {
                ...orden,
                clienteNombre: clienteInfo ? clienteInfo.nombreCompleto : orden.nombreCliente || 'Cliente no registrado',
                tiendaNombre: tiendaInfo ? tiendaInfo.nombreNegocio : orden.nombreTienda || 'Tienda no registrada',
                repartidorNombre: repartidorInfo ? repartidorInfo.nombreCompleto : 'Sin asignar'
            };
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Lista de órdenes obtenida correctamente',
            ordenes: ordenesCompletas,
            totalOrdenes: ordenesCompletas.length
        });

    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al cargar las órdenes',
            detalleError: error.message
        });
    }
});

app.get('/pedidos', (req, res) => {
    req.url = '/orders';
    return app._router.handle(req, res);
});

// Actualizar el estado de una orden específica
app.put('/orders/:id', (req, res) => {
    try {
        const idOrden = parseInt(req.params.id);
        const { estado } = req.body;

        // Validar que se proporcione el estado
        if (!estado) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El campo estado es requerido'
            });
        }

        // Buscar la orden
        const ordenEncontrada = ordenesRealizadas.find(o => o.id === idOrden);

        if (!ordenEncontrada) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Orden no encontrada en el sistema'
            });
        }

        // Validar que el estado sea válido
        const estadosPermitidos = ['pendiente', 'aceptado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Estado no válido. Estados permitidos: ' + estadosPermitidos.join(', ')
            });
        }

        // Actualizar el estado
        ordenEncontrada.estadoActual = estado;

        // Si se acepta la orden, asignar un repartidor automáticamente
        if (estado === 'aceptado' && !ordenEncontrada.idRepartidor) {
            const repartidorDisponible = repartidoresActivos.find(r => r.estaDisponible);
            if (repartidorDisponible) {
                ordenEncontrada.idRepartidor = repartidorDisponible.id;
                repartidorDisponible.estaDisponible = false; // Marcar como ocupado
            }
        }

        res.status(200).json({
            exito: true,
            mensaje: `Estado de la orden actualizado a: ${estado}`,
            orden: {
                id: ordenEncontrada.id,
                estado: ordenEncontrada.estadoActual,
                cliente: ordenEncontrada.nombreCliente,
                tienda: ordenEncontrada.nombreTienda
            }
        });

    } catch (error) {
        console.error('Error al actualizar orden:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el estado de la orden',
            detalleError: error.message
        });
    }
});

app.put('/pedidos/:id', (req, res) => {
    req.url = `/orders/${req.params.id}`;
    return app._router.handle(req, res);
});

// ENDPOINTS DE ESTADÍSTICAS Y MONITOREO

// Obtener estadísticas generales del sistema
app.get('/stats', (req, res) => {
    try {
        // Calcular estadísticas en tiempo real
        const estadisticas = {
            totalUsuarios: clientesRegistrados.length,
            totalTiendas: tiendasDisponibles.length,
            totalRepartidores: repartidoresActivos.length,
            totalProductos: menuProductos.length,
            totalOrdenes: ordenesRealizadas.length,
            
            // Estadísticas de tiendas
            tiendasActivas: tiendasDisponibles.filter(t => t.estaActiva).length,
            tiendasInactivas: tiendasDisponibles.filter(t => !t.estaActiva).length,
            
            // Estadísticas de repartidores
            repartidoresDisponibles: repartidoresActivos.filter(r => r.estaDisponible).length,
            repartidoresOcupados: repartidoresActivos.filter(r => !r.estaDisponible).length,
            
            // Estadísticas de órdenes por estado
            ordenesPendientes: ordenesRealizadas.filter(o => o.estadoActual === 'pendiente').length,
            ordenesAceptadas: ordenesRealizadas.filter(o => o.estadoActual === 'aceptado').length,
            ordenesEnCamino: ordenesRealizadas.filter(o => o.estadoActual === 'en_camino').length,
            ordenesEntregadas: ordenesRealizadas.filter(o => o.estadoActual === 'entregado').length,
            ordenesCanceladas: ordenesRealizadas.filter(o => o.estadoActual === 'cancelado').length,
            
            // Estadísticas financieras
            ventasTotales: ordenesRealizadas
                .filter(o => o.estadoActual === 'entregado')
                .reduce((total, orden) => total + orden.montoTotal, 0),
            
            ventasPendientes: ordenesRealizadas
                .filter(o => ['pendiente', 'aceptado', 'en_camino'].includes(o.estadoActual))
                .reduce((total, orden) => total + orden.montoTotal, 0),
                
            // Fecha de actualización
            fechaActualizacion: new Date().toISOString()
        };

        res.status(200).json({
            exito: true,
            mensaje: 'Estadísticas del sistema Tobonsita Rappi',
            estadisticas: estadisticas,
            tiempoRespuesta: 'Datos en tiempo real'
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al generar estadísticas del sistema',
            detalleError: error.message
        });
    }
});

// MANEJO DE ERRORES Y RUTAS NO ENCONTRADAS

// Manejo de rutas no encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({
        exito: false,
        mensaje: '🔍 Oops! La ruta que buscas no existe en Tobonsita Rappi',
        rutaSolicitada: req.originalUrl,
        metodoUsado: req.method,
        sugerencia: 'Verifica la URL y el método HTTP. Consulta GET / para ver todas las rutas disponibles'
    });
});

// Manejo de errores globales del servidor
app.use((error, req, res, next) => {
    console.error('💥 Error no manejado:', error);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor Tobonsita Rappi',
        detalleError: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
        timestamp: new Date().toISOString()
    });
});

// INICIALIZACIÓN DEL SERVIDOR
app.listen(PUERTO, () => {
    console.log(`TOBONSITA RAPPI - SERVIDOR INICIADO`);
});

// Exportar la aplicación para pruebas y desarrollo
module.exports = app;