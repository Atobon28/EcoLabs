// comida.js - API de comidas básica

async function buscarComida() {
    mostrarCarga('comidaResult');
    
    try {
        const respuesta = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const datos = await respuesta.json();
        
        if (datos.meals && datos.meals.length > 0) {
            const comida = datos.meals[0];
            
            document.getElementById('comidaResult').innerHTML = `
                <div class="result-content">
                    <img src="${comida.strMealThumb}" alt="${comida.strMeal}">
                    <h3>${comida.strMeal}</h3>
                    <p><strong>Categoría:</strong> ${comida.strCategory}</p>
                    <p><strong>Región:</strong> ${comida.strArea}</p>
                </div>
            `;
        } else {
            mostrarError('comidaResult', 'No se encontraron platos');
        }
    } catch (error) {
        mostrarError('comidaResult', 'Error al cargar el plato');
    }
}