// main.js
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const formData = new FormData();
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('patientName', document.getElementById('patientName').value);
    formData.append('doctorName', document.getElementById('doctorName').value);

    fetch('https://api.ejemplo.com/diagnostic', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Procesar el resultado
            document.getElementById('result').innerText = `Diagnóstico: ${data.diagnosis}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Hubo un error al procesar la imagen.';
        });
});
