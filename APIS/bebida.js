async function buscarBebida() {
    mostrarCarga('bebidaResult');
    
    try {
        const respuesta = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const datos = await respuesta.json();
        
        if (datos.drinks && datos.drinks.length > 0) {
            const bebida = datos.drinks[0];
            
            document.getElementById('bebidaResult').innerHTML = `
                <div class="result-content">
                    <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}">
                    <h3>${bebida.strDrink}</h3>
                    <p><strong>Tipo:</strong> ${bebida.strAlcoholic}</p>
                    <p><strong>Categoría:</strong> ${bebida.strCategory}</p>
                </div>
            `;
        } else {
            mostrarError('bebidaResult', 'No se encontraron bebidas');
        }
    } catch (error) {
        mostrarError('bebidaResult', 'Error al cargar la bebida');
    }
}