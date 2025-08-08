// pais.js - API de países básica

async function buscarPais() {
    mostrarCarga('paisResult');
    
    const paises = ['mexico', 'italy', 'france', 'japan', 'brazil', 'spain', 'germany', 'canada'];
    const paisRandom = paises[Math.floor(Math.random() * paises.length)];
    
    try {
        const respuesta = await fetch(`https://restcountries.com/v3.1/name/${paisRandom}`);
        const datos = await respuesta.json();
        
        if (datos && datos[0]) {
            const pais = datos[0];
            const capital = pais.capital ? pais.capital[0] : 'No disponible';
            const poblacion = pais.population ? pais.population.toLocaleString() : 'No disponible';
            
            document.getElementById('paisResult').innerHTML = `
                <div class="result-content">
                    <img src="${pais.flags.svg}" alt="Bandera de ${pais.name.common}" style="height: 80px; width: auto;">
                    <h3>${pais.name.common}</h3>
                    <p><strong>Capital:</strong> ${capital}</p>
                    <p><strong>Población:</strong> ${poblacion}</p>
                    <p><strong>Región:</strong> ${pais.region}</p>
                </div>
            `;
        } else {
            mostrarError('paisResult', 'No se encontró información del país');
        }
    } catch (error) {
        mostrarError('paisResult', 'Error al cargar información del país');
    }
}