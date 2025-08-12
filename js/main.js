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
            scrollToPosts();
            
        } catch (error) {
            alert('Error al crear post');
        }
    });
}

// Eliminar post
async function handleDelete(id) {
    if (confirm('¿Eliminar este post?')) {
        try {
            await deletePost(id);
            
            // Quitar de la lista
            allPosts = allPosts.filter(post => post.id !== id);
            
            // Mostrar posts actualizados
            showAllPosts(allPosts);
            
            alert('Post eliminado');
            
        } catch (error) {
            alert('Error al eliminar');
        }
    }
}