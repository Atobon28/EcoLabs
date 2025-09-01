// VARIABLES GLOBALES DE LA APLICACIÓN

// URL base del servidor backend
const API_BASE = 'http://localhost:5050';

// Variables para almacenar el estado de la aplicación
let currentUser = null; // Usuario actual logueado
let currentStore = null; // Tienda seleccionada actualmente
let cart = []; // Carrito de compras
let allStores = []; // Lista de todas las tiendas
let currentMenu = []; // Menú de la tienda actual

// FUNCIONES DE UTILIDAD

// Función para mostrar mensajes al usuario
function showMessage(elementId, message, type = 'info') {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Función para mostrar/ocultar el overlay de carga
function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Función para cambiar entre pantallas
function showScreen(screenId) {
   // Ocultar todas las pantallas
   const screens = document.querySelectorAll('.screen');
   screens.forEach(screen => screen.classList.remove('active'));
   
   // Mostrar la pantalla seleccionada
   document.getElementById(screenId).classList.add('active');
}

// Función para formatear números como moneda
function formatCurrency(amount) {
   return new Intl.NumberFormat('es-CO').format(amount);
}

// Función para calcular el total del carrito
function calculateCartTotal() {
   return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
   const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
   document.getElementById('cartCount').textContent = totalItems;
}

// FUNCIONES DE API

// Función para hacer peticiones al servidor
async function apiRequest(endpoint, method = 'GET', data = null) {
   try {
       showLoading(true);
       
       const config = {
           method: method,
           headers: {
               'Content-Type': 'application/json'
           }
       };
       
       if (data) {
           config.body = JSON.stringify(data);
       }
       
       const response = await fetch(`${API_BASE}${endpoint}`, config);
       const result = await response.json();
       
       showLoading(false);
       return result;
       
   } catch (error) {
       showLoading(false);
       console.error('Error en petición API:', error);
       return { exito: false, mensaje: 'Error de conexión con el servidor' };
   }
}

// FUNCIONES DEL LOGIN

// Función para procesar el login
async function handleLogin(username, password) {
   const result = await apiRequest('/login', 'POST', { username, password });
   
   if (result.exito) {
       currentUser = result.usuario;
       localStorage.setItem('currentUser', JSON.stringify(currentUser));
       showMessage('loginMessage', result.mensaje, 'success');
       
       setTimeout(() => {
           loadStores();
       }, 1500);
   } else {
       showMessage('loginMessage', result.mensaje, 'error');
   }
}

// Función para cargar las tiendas
async function loadStores() {
   const result = await apiRequest('/stores');
   
   if (result.exito) {
       allStores = result.tiendas;
       displayStores();
       showScreen('storesScreen');
       
       // Mostrar nombre del usuario
       document.getElementById('welcomeUser').textContent = 
           `¡Hola ${currentUser.nombre}!`;
   } else {
       showMessage('storesMessage', result.mensaje, 'error');
   }
}

// Función para mostrar las tiendas en pantalla
function displayStores() {
   const container = document.getElementById('storesContainer');
   container.innerHTML = '';
   
   if (allStores.length === 0) {
       container.innerHTML = '<p class="empty-state">No hay tiendas disponibles</p>';
       return;
   }
   
   allStores.forEach(store => {
       const storeCard = document.createElement('div');
       storeCard.className = 'store-card';
       storeCard.onclick = () => selectStore(store);
       
       storeCard.innerHTML = `
           <img src="${store.imagen}" alt="${store.nombre}" 
                onerror="this.src='https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Tienda'">
           <div class="store-info">
               <h3>${store.nombre}</h3>
               <p>${store.descripcion}</p>
               <div class="store-meta">
                   <span class="rating">⭐ ${store.calificacion}</span>
                   <span class="delivery-time">⏰ ${store.tiempoEntrega}</span>
                   <span class="store-status ${store.activa ? 'active' : 'inactive'}">
                       ${store.activa ? '🟢 Abierta' : '🔴 Cerrada'}
                   </span>
               </div>
           </div>
       `;
       
       container.appendChild(storeCard);
   });
}

// FUNCIONES DEL MENÚ

// Función para seleccionar una tienda
async function selectStore(store) {
   if (!store.activa) {
       alert('Esta tienda está cerrada en este momento');
       return;
   }
   
   currentStore = store;
   await loadMenu(store.id);
}

// Función para cargar el menú de una tienda
async function loadMenu(storeId) {
   const result = await apiRequest(`/restaurant/${storeId}/menu`);
   
   if (result.exito) {
       currentMenu = result.menu;
       displayMenu(result.informacionTienda);
       showScreen('menuScreen');
   } else {
       showMessage('storesMessage', result.mensaje, 'error');
   }
}

// Función para mostrar el menú en pantalla
function displayMenu(storeInfo) {
   // Actualizar información de la tienda
   document.getElementById('restaurantName').textContent = storeInfo.nombre;
   
   const infoContainer = document.getElementById('restaurantInfo');
   infoContainer.innerHTML = `
       <h3>${storeInfo.nombre}</h3>
       <p>${storeInfo.descripcion}</p>
       <div class="store-meta">
           <span>📍 ${storeInfo.direccion}</span>
           <span>⏰ ${storeInfo.horario}</span>
           <span>⭐ ${storeInfo.calificacion}</span>
           <span>🚚 ${storeInfo.tiempoEntrega}</span>
       </div>
   `;
   
   // Mostrar productos
   const productsContainer = document.getElementById('productsContainer');
   productsContainer.innerHTML = '';
   
   if (currentMenu.length === 0) {
       productsContainer.innerHTML = '<p class="empty-state">No hay productos disponibles</p>';
       return;
   }
   
   currentMenu.forEach(product => {
       const productCard = document.createElement('div');
       productCard.className = 'product-card';
       
       productCard.innerHTML = `
           <img src="${product.imagenUrl}" alt="${product.nombreProducto}"
                onerror="this.src='https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Producto'">
           <div class="product-info">
               <h4>${product.nombreProducto}</h4>
               <p>${product.descripcionDetallada}</p>
               <div class="product-price">$${formatCurrency(product.precioVenta)}</div>
               <button class="add-to-cart" onclick="addToCart(${product.id})">
                   Agregar al Carrito
               </button>
           </div>
       `;
       
       productsContainer.appendChild(productCard);
   });
}

// FUNCIONES DEL CARRITO

// Función para agregar producto al carrito
function addToCart(productId) {
   const product = currentMenu.find(p => p.id === productId);
   if (!product) return;
   
   // Verificar si el producto ya está en el carrito
   const existingItem = cart.find(item => item.id === productId);
   
   if (existingItem) {
       existingItem.cantidad += 1;
   } else {
       cart.push({
           id: product.id,
           nombre: product.nombreProducto,
           precio: product.precioVenta,
           imagen: product.imagenUrl,
           tienda: currentStore.nombre,
           cantidad: 1
       });
   }
   
   updateCartCount();
   showMessage('menuMessage', 'Producto agregado al carrito', 'success');
}

// Función para mostrar el carrito
function showCart() {
   displayCart();
   showScreen('cartScreen');
}

// Función para mostrar los items del carrito
function displayCart() {
   const cartItems = document.getElementById('cartItems');
   const cartTotal = document.getElementById('cartTotal');
   const emptyCart = document.getElementById('emptyCart');
   const proceedBtn = document.getElementById('proceedToPayment');
   
   if (cart.length === 0) {
       cartItems.innerHTML = '';
       emptyCart.style.display = 'block';
       proceedBtn.disabled = true;
       cartTotal.textContent = '0';
       return;
   }
   
   emptyCart.style.display = 'none';
   proceedBtn.disabled = false;
   
   cartItems.innerHTML = '';
   
   cart.forEach(item => {
       const cartItem = document.createElement('div');
       cartItem.className = 'cart-item';
       
       cartItem.innerHTML = `
           <img src="${item.imagen}" alt="${item.nombre}"
                onerror="this.src='https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=Item'">
           <div class="cart-item-info">
               <h4>${item.nombre}</h4>
               <p>Tienda: ${item.tienda}</p>
               <p>Precio unitario: $${formatCurrency(item.precio)}</p>
           </div>
           <div class="cart-item-controls">
               <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
               <span class="quantity">${item.cantidad}</span>
               <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
               <button class="remove-item" onclick="removeFromCart(${item.id})">Eliminar</button>
           </div>
       `;
       
       cartItems.appendChild(cartItem);
   });
   
   const total = calculateCartTotal();
   cartTotal.textContent = formatCurrency(total);
}

// Función para actualizar cantidad de un producto
function updateQuantity(productId, change) {
   const item = cart.find(item => item.id === productId);
   if (!item) return;
   
   item.cantidad += change;
   
   if (item.cantidad <= 0) {
       removeFromCart(productId);
   } else {
       displayCart();
       updateCartCount();
   }
}

// Función para remover producto del carrito
function removeFromCart(productId) {
   cart = cart.filter(item => item.id !== productId);
   displayCart();
   updateCartCount();
   
   if (cart.length === 0) {
       showMessage('menuMessage', 'Carrito vacío', 'info');
   }
}

// FUNCIONES DE CHECKOUT

// Función para ir al checkout
function goToCheckout() {
   displayCheckoutSummary();
   showScreen('checkoutScreen');
}

// Función para mostrar resumen en checkout
function displayCheckoutSummary() {
   const summaryContainer = document.getElementById('checkoutSummary');
   const finalTotal = document.getElementById('finalTotal');
   
   summaryContainer.innerHTML = '';
   
   cart.forEach(item => {
       const summaryItem = document.createElement('div');
       summaryItem.className = 'summary-item';
       summaryItem.innerHTML = `
           <span>${item.nombre} x${item.cantidad}</span>
           <span>$${formatCurrency(item.precio * item.cantidad)}</span>
       `;
       summaryContainer.appendChild(summaryItem);
   });
   
   const total = calculateCartTotal();
   const summaryTotal = document.createElement('div');
   summaryTotal.className = 'summary-total';
   summaryTotal.innerHTML = `
       <span>Total:</span>
       <span>$${formatCurrency(total)}</span>
   `;
   summaryContainer.appendChild(summaryTotal);
   
   finalTotal.textContent = formatCurrency(total);
}

// Función para procesar el pedido
async function processOrder(orderData) {
   // Crear una orden por cada producto (simplificado)
   const mainProduct = cart[0]; // Tomar el primer producto como principal
   
   const orderPayload = {
       producto: mainProduct.nombre,
       cliente: currentUser.nombreUsuario,
       tienda: mainProduct.tienda,
       direccion: orderData.address,
       total: calculateCartTotal(),
       notas: orderData.notes
   };
   
   const result = await apiRequest('/orders', 'POST', orderPayload);
   
   if (result.exito) {
       // Limpiar carrito
       const orderDetails = {
           id: result.orden.id,
           total: result.orden.total,
           items: [...cart],
           direccion: orderData.address,
           telefono: orderData.phone,
           metodoPago: orderData.payment
       };
       
       cart = [];
       updateCartCount();
       
       showOrderConfirmation(orderDetails);
   } else {
       showMessage('checkoutMessage', result.mensaje, 'error');
   }
}

// FUNCIONES DE CONFIRMACIÓN

// Función para mostrar confirmación de pedido
function showOrderConfirmation(orderDetails) {
   const detailsContainer = document.getElementById('confirmedOrderDetails');
   
   detailsContainer.innerHTML = `
       <p><strong>Número de Pedido:</strong> #${orderDetails.id}</p>
       <p><strong>Total:</strong> $${formatCurrency(orderDetails.total)}</p>
       <p><strong>Dirección:</strong> ${orderDetails.direccion}</p>
       <p><strong>Teléfono:</strong> ${orderDetails.telefono}</p>
       <p><strong>Método de Pago:</strong> ${orderDetails.metodoPago}</p>
       
       <h4>Productos:</h4>
       <ul>
           ${orderDetails.items.map(item => 
               `<li>${item.nombre} x${item.cantidad} - $${formatCurrency(item.precio * item.cantidad)}</li>`
           ).join('')}
       </ul>
   `;
   
   showScreen('confirmationScreen');
}

// FUNCIONES DE ÓRDENES

// Función para cargar las órdenes del usuario
async function loadUserOrders() {
   const result = await apiRequest('/orders');
   
   if (result.exito) {
       const userOrders = result.ordenes.filter(order => 
           order.nombreCliente === currentUser.nombreUsuario
       );
       
       displayOrders(userOrders);
       showScreen('ordersScreen');
   } else {
       showMessage('ordersMessage', result.mensaje, 'error');
   }
}

// Función para mostrar las órdenes
function displayOrders(orders) {
   const ordersContainer = document.getElementById('ordersContainer');
   const noOrders = document.getElementById('noOrders');
   
   if (orders.length === 0) {
       ordersContainer.innerHTML = '';
       noOrders.style.display = 'block';
       return;
   }
   
   noOrders.style.display = 'none';
   ordersContainer.innerHTML = '';
   
   orders.forEach(order => {
       const orderCard = document.createElement('div');
       orderCard.className = 'order-card';
       
       const fecha = new Date(order.fechaCreacion).toLocaleDateString('es-CO', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
           hour: '2-digit',
           minute: '2-digit'
       });
       
       orderCard.innerHTML = `
           <div class="order-header">
               <span class="order-id">Pedido #${order.id}</span>
               <span class="order-date">${fecha}</span>
           </div>
           
           <div class="order-content">
               <h4>${order.nombreTienda || 'Tienda'}</h4>
               <div class="order-items">
                   ${order.productosOrdenados.map(item => 
                       `${item.nombreProducto} x${item.cantidadSolicitada}`
                   ).join(', ')}
               </div>
               <p><strong>Dirección:</strong> ${order.direccionEntrega}</p>
           </div>
           
           <div class="order-footer">
               <span class="order-total">$${formatCurrency(order.montoTotal)}</span>
               <span class="order-status-badge status-${order.estadoActual}">
                   ${order.estadoActual.replace('_', ' ')}
               </span>
           </div>
       `;
       
       ordersContainer.appendChild(orderCard);
   });
}

// EVENT LISTENERS

document.addEventListener('DOMContentLoaded', function() {
   // Verificar si hay un usuario logueado
   const savedUser = localStorage.getItem('currentUser');
   if (savedUser) {
       currentUser = JSON.parse(savedUser);
       loadStores();
   }
   
   // LOGIN FORM
   document.getElementById('loginForm').addEventListener('submit', function(e) {
       e.preventDefault();
       const username = document.getElementById('username').value;
       const password = document.getElementById('password').value;
       handleLogin(username, password);
   });
   
   // NAVEGACIÓN ENTRE PANTALLAS
   document.getElementById('viewOrdersBtn').addEventListener('click', loadUserOrders);
   document.getElementById('logoutBtn').addEventListener('click', function() {
       currentUser = null;
       localStorage.removeItem('currentUser');
       cart = [];
       updateCartCount();
       showScreen('loginScreen');
   });
   
   document.getElementById('backToStores').addEventListener('click', function() {
       showScreen('storesScreen');
   });
   
   document.getElementById('viewCartBtn').addEventListener('click', showCart);
   
   document.getElementById('backToMenu').addEventListener('click', function() {
       showScreen('menuScreen');
   });
   
   document.getElementById('backToStoresFromCart').addEventListener('click', function() {
       showScreen('storesScreen');
   });
   
   document.getElementById('proceedToPayment').addEventListener('click', goToCheckout);
   
   document.getElementById('backToCart').addEventListener('click', function() {
       showScreen('cartScreen');
   });
   
   document.getElementById('backToStoresFromOrders').addEventListener('click', function() {
       showScreen('storesScreen');
   });
   
   document.getElementById('viewAllOrdersBtn').addEventListener('click', loadUserOrders);
   
   document.getElementById('orderAgainBtn').addEventListener('click', function() {
       showScreen('storesScreen');
   });
   
   document.getElementById('startOrderingBtn').addEventListener('click', function() {
       showScreen('storesScreen');
   });
   
   document.getElementById('refreshOrders').addEventListener('click', loadUserOrders);
   
   // CHECKOUT FORM
   document.getElementById('checkoutForm').addEventListener('submit', function(e) {
       e.preventDefault();
       
       const formData = new FormData(e.target);
       const orderData = {
           address: document.getElementById('address').value,
           phone: document.getElementById('phone').value,
           payment: formData.get('payment'),
           notes: document.getElementById('orderNotes').value
       };
       
       processOrder(orderData);
   });
});

// FUNCIONES GLOBALES PARA LOS BOTONES
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;