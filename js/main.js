let allPosts = [];

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupForm();
});

// Cargar posts del servidor
async function loadPosts() {
    try {
        document.getElementById('loading').style.display = 'block';
        allPosts = await getAllPosts();
        showAllPosts(allPosts);
    } catch (error) {
        showError('Error al cargar posts');
    }
}

// Configurar el formulario
function setupForm() {
    const form = document.getElementById('postForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const imageUrl = document.getElementById('imageUrl').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        
        // Validar campos
        if (!imageUrl || !title || !description) {
            alert('Completa todos los campos');
            return;
        }
        
        try {
            // Crear post
            const newPost = await createPost({
                imageUrl: imageUrl,
                title: title,
                description: description
            });
            
            // Agregar a la lista
            allPosts.push(newPost);
            
            // Mostrar posts actualizados
            showAllPosts(allPosts);
            
            // Limpiar formulario
            form.reset();
            
            alert('Post creado!');
            
        } catch (error) {
            alert('Error al crear post');
        }
    });
}

// Manejar eliminación de posts
async function handleDelete(postId) {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        try {
            // Eliminar del servidor
            await deletePost(postId);
            
            // Remover de la lista local (comparar como strings)
            allPosts = allPosts.filter(post => post.id !== postId);
            
            // Actualiza
            showAllPosts(allPosts);
            
            alert('Post eliminado correctamente');
            
        } catch (error) {
            alert('Error al eliminar el post');
            console.error('Error:', error);
        }
    }
}