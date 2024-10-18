document.addEventListener('DOMContentLoaded', function () {
    //const patientSelect = document.getElementById('patientName');
    const doctorSelect = document.getElementById('doctorName');
    //const patientDniInput = document.getElementById('patientDni');
    const doctorMatriculaInput = document.getElementById('doctorMatricula');

    // Escuchar el cambio en el select del doctor
    doctorSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const selectedMatricula = selectedOption.getAttribute('data-matricula');
        doctorMatriculaInput.value = selectedMatricula;
    });

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
        const doctorMatricula = document.getElementById('doctorMatricula').value;
        const imageInput = document.getElementById('imageInput').files[0];


        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.exec(imageInput.name)) {
            alert('Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG).');
            document.getElementById('loading').style.display = 'none';
            return;
        }


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
        formData.append('doctorMatricula', doctorMatricula);
        formData.append('image', imageInput);

        // Verifica que los datos sean correctos antes de enviarlos
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

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

            // Manejo de respuesta cuando no es una radiografía de tórax
            if (data.message) {
                document.getElementById('result').innerHTML = `Aviso: ${data.message}`;  // Mostrar que no es una radiografía de tórax
            } else {
                // Mostrar el resultado del diagnóstico

                document.getElementById('result').innerHTML = `
    <div><strong>Diagnóstico:</strong> ${data.diagnosis}</div>
    <div><strong>Probabilidad:</strong> ${data.probability.toFixed(2)}</div>
    <div><strong>Confianza:</strong> ${data.confidence.toFixed(2)}</div>
    <div><strong>Incertidumbre:</strong> ${data.entropy.toFixed(2)}</div>
`;
            }
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
            document.getElementById('result').innerHTML = 'Hubo un error al procesar la imagen.';
        } finally {
            // Ocultar el mensaje de carga
            document.getElementById('result').style.display = 'block';
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
        document.getElementById('result').style.display = 'none';
    });

    document.getElementById('buscarPatient').addEventListener('click', function () {

        const dniBuscar = document.getElementById('patientDni');
        const inputNameBuscar = document.getElementById('patientName');

        switch (dniBuscar.value) {
            case "35000000":
                inputNameBuscar.value = "Juan Pérez";
                break;
            case "36000000":
                inputNameBuscar.value = "Jorge Gómez";
                break;
            case "37000000":
                inputNameBuscar.value = "Carlos Díaz";
                break;
            default:
                alert("El paciente no se encuentra en la base de datos");
        }
    });

});