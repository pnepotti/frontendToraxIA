document.getElementById('diagnostic-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Mostrar mensaje de procesamiento
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';

    //Para probar
    document.getElementById('imagen').innerHTML = document.getElementById('imageInput').files[0];

    // Obtener los valores de los campos
    const patientName = document.getElementById('patientName').value;
    const patientDni = document.getElementById('patientDni').value;
    const doctorName = document.getElementById('doctorName').value;
    const imageInput = document.getElementById('imageInput').files[0];

    // Validaciones básicas
    if (!imageInput || !patientName || !patientDni || !doctorName) {
        alert('Por favor, completa todos los campos y selecciona una imagen.');
        document.getElementById('loading').style.display = 'none';
        return;
    }

    // Crear un FormData para enviar la imagen y los datos
    const formData = new FormData();

    // Agregar los datos al FormData de forma individual
    formData.append('patientName', patientName);
    formData.append('patientDni', patientDni);
    formData.append('doctorName', doctorName);
    formData.append('image', imageInput);  // Asegúrate de que "image" es el nombre esperado por la API

    try {
        // Realizar la solicitud a la API
        const response = await fetch('http://localhost:8000/diagnostics/api/diagnostic/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        // Mostrar el resultado del diagnóstico
        document.getElementById('imagen').innerHTML = document.getElementById('imageInput').files[0];
        document.getElementById('result').innerHTML = `Diagnóstico: ${data.diagnosis}`;  // Asegúrate de que "diagnosis" sea el campo correcto
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        document.getElementById('result').innerHTML = 'Hubo un error al procesar la imagen.';
    } finally {
        // Ocultar el mensaje de carga
        document.getElementById('loading').style.display = 'none';
        document.getElementById('imagen').style.display = 'block';
    }
});
document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
        const reader = new FileReader();

        // Una vez que el archivo es leído, lo convertimos en una URL
        reader.onload = function (e) {
            // Asignamos el resultado (la URL de la imagen) al src de la etiqueta img
            document.getElementById('imagen').src = e.target.result;
            document.getElementById('imagen').style.display = 'block';
        }

        // Leer el archivo como una URL de datos
        reader.readAsDataURL(file);
    }
});
document.getElementById('LimpiarButton').addEventListener('click', function () {
    // Obtener el formulario
    var form = document.getElementById('diagnostic-form');

    // Reinicializar el formulario
    form.reset();

    // Eliminar la vista previa de la imagen
    document.getElementById('imagen').src = '';
    document.getElementById('imagen').style.display = 'none';
});
