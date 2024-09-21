// Búsqueda por DNI
document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const dni = document.getElementById('dni').value;

    try {
        const response = await fetch(`http://localhost:8000/diagnostics/api/images/?dni=${dni}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        // Procesa la respuesta de imágenes aquí
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
});
