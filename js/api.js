const API_URL = 'http://localhost:3004/posts';

// Obtener todos los posts
async function getAllPosts() {
    const response = await fetch(API_URL);
    const posts = await response.json();
    return posts;
}

// Crear un post nuevo
async function createPost(post) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });
    const newPost = await response.json();
    return newPost;
}

// Eliminar un post
async function deletePost(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
}