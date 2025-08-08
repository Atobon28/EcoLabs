// anime.js - API de anime básica

async function buscarAnime() {
    const query = document.getElementById('animeQuery').value.trim();
    const type = document.getElementById('animeType').value;
    const limit = document.getElementById('animeLimit').value || 5;
    
    if (!query) {
        alert('Por favor ingresa el nombre de un anime');
        return;
    }
    
    mostrarCarga('animeResult');
    
    try {
        let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${limit}`;
        if (type) {
            url += `&type=${type}`;
        }
        
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        
        if (datos.data && datos.data.length > 0) {
            let html = '<div class="anime-results">';
            
            datos.data.forEach(anime => {
                const score = anime.score ? anime.score.toFixed(1) : 'N/A';
                const year = anime.year || 'N/A';
                const episodes = anime.episodes || 'N/A';
                
                html += `
                    <div class="anime-item">
                        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                        <h4>${anime.title}</h4>
                        <p><strong>Puntuación:</strong> ${score}</p>
                        <p><strong>Año:</strong> ${year}</p>
                        <p><strong>Episodios:</strong> ${episodes}</p>
                        <p><strong>Tipo:</strong> ${anime.type || 'N/A'}</p>
                    </div>
                `;
            });
            
            html += '</div>';
            document.getElementById('animeResult').innerHTML = html;
        } else {
            mostrarError('animeResult', 'No se encontraron resultados');
        }
    } catch (error) {
        mostrarError('animeResult', 'Error al buscar anime');
    }
}