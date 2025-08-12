function createPostCard(post) {
    return `
        <div class="post-card">
            <img src="${post.imageUrl}" alt="${post.title}" class="post-image">
            <div class="post-content">
                <div class="post-title">${post.title}</div>
                <div class="post-description">${post.description}</div>
                <button class="delete-btn" onclick="handleDelete(${post.id})">DELETE</button>
            </div>
        </div>
    `;
}

function showAllPosts(posts) {
    const container = document.getElementById('postsContainer');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'none';
    
    if (posts.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><h3>No hay posts disponibles</h3></div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < posts.length; i++) {
        html += createPostCard(posts[i]);
    }
    
    container.innerHTML = html;
}

function showError(message) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    loading.style.display = 'none';
    error.textContent = message;
    error.style.display = 'block';
}

async function handleDelete(id) {
    if (confirm('Eliminar este post?')) {
        try {
            await deletePost(id);
            // FIX: Convertir id a número para la comparación
            allPosts = allPosts.filter(post => post.id !== Number(id));
            showAllPosts(allPosts);
            alert('Post eliminado');
        } catch (error) {
            alert('Error al eliminar');
        }
    }
}