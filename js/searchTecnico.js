// Búsqueda por DNI
const baseUrl = 'http://localhost:8000'; // Cambiar en producción
// Obtener el modal y elementos
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modal-image');
const closeBtn = document.getElementsByClassName('close')[0];
const patientNameContainer = document.getElementById('patient-name-container');

document.addEventListener('DOMContentLoaded', function () {
    const opcionDeBusqueda = document.getElementById('opcionDeBusqueda');
    const filtroDeBusqueda = document.getElementById('filtroDeBusqueda');

    // Escuchar el cambio en el select del paciente
    opcionDeBusqueda.addEventListener('change', function () {
        filtroDeBusqueda.value = "";
        const selectedOption = this.options[this.selectedIndex];
        const selectedOpcion = selectedOption.getAttribute('data-opcion');
        filtroDeBusqueda.placeholder = selectedOpcion;
    });
})

document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const container = document.getElementById('radiography-container');

    container.innerHTML = ''; // Limpiar el contenedor
    const searchValue = document.getElementById('filtroDeBusqueda').value;

    // Validaciones básicas
    if (!searchValue) {
        alert('Por favor, completa el campo');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/diagnostics/api/images/?dni=${searchValue}`);
        if (!response.ok) {
            if (response.status === 404) {
                container.innerHTML = '<p>No se encontraron radiografías.</p>';
            } else {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return;
        }

        const data = await response.json();


        // Mostrar el nombre del paciente, si está en la respuesta

        const patientName = data.radiographies[0].patient_name || "Paciente no encontrado"; // Cambiar esto si el nombre tiene otro campo
        patientNameContainer.innerHTML = `<h3>Paciente: ${patientName}</h3>`;

        displayRadiographies(data.radiographies);

    } catch (error) {
        console.error('Error en la búsqueda:', error);
    } finally {
        // Mostrar todas las imágenes al inicio
        const elementos = document.getElementsByClassName("card-image");
        for (let i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "block";
        }
    }
})


// Mostrar las radiografías en el contenedor
function displayRadiographies(radiographies) {
    const container = document.getElementById('radiography-container');
    container.innerHTML = ''; // Limpiar el contenedor

    if (radiographies.length === 0) {
        container.innerHTML = '<p>No se encontraron radiografías para este paciente.</p>';
        return;
    }

    radiographies.forEach(radiography => {
        const radiographyElement = document.createElement('div');
        radiographyElement.classList.add('card-image');

        const fullImageUrl = `${baseUrl}/media/${radiography.image_url.split('media/')[1]}`;

        const predictionsList = radiography.predictions.map(prediction => `
            <li>
                <br>
                <strong>Enfermedad:</strong> ${prediction.disease}<br>
                <strong>Probabilidad:</strong> ${(prediction.probability * 100).toFixed(1)}%<br>
                <strong>Confianza:</strong> ${(prediction.confidence * 100).toFixed(1)}% ${prediction.confidence > 0.7 ? '- Alta' : '- Baja'}<br>
                <strong>Incertidumbre:</strong> ${(prediction.entropy * 100).toFixed(1)}% ${prediction.entropy > 0.5 ? '- Alta' : '- Baja'}<br><br>
                </div>
             </li>
        `).join('');

        radiographyElement.innerHTML = `
            <img src="${fullImageUrl}" alt="Radiografía ID: ${radiography.radiography_id}" class="thumbnail" onclick="openModal('${fullImageUrl}')">
            <ul>
                <li><strong>Médico:</strong> ${radiography.doctor_name}</li>
                <li><strong>Fecha:</strong> ${new Date(radiography.uploaded_at).toLocaleDateString()}</li>
                ${predictionsList}
            </ul>
        `;

        container.appendChild(radiographyElement);
    });
}

// Abrir modal para mostrar la imagen
function openModal(imageSrc) {
    modal.style.display = "flex";
    modalImg.src = imageSrc;
    document.body.classList.add('modal-open'); // Deshabilitar el scroll del body
}

// Cerrar modal
closeBtn.onclick = function () {
    modal.style.display = "none";
    document.body.classList.remove('modal-open'); // Habilitar el scroll del body
}

// Zoom y desplazamiento de la imagen en el modal
let isZoomed = false;

modalImg.onclick = function (e) {
    const rect = modalImg.getBoundingClientRect(); // Obtener las coordenadas de la imagen visible
    const offsetX = e.clientX - rect.left; // Coordenada X dentro de la imagen visible
    const offsetY = e.clientY - rect.top;  // Coordenada Y dentro de la imagen visible

    // Calcular el porcentaje del clic dentro de la imagen
    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    if (isZoomed) {
        // Restablecer el zoom
        modalImg.style.transform = "scale(1)";
        modalImg.style.transformOrigin = "center center"; // Volver a centrar la imagen
        modalImg.style.cursor = "zoom-in";
        modalImg.style.width = "500px";
        isZoomed = false;
    } else {
        // Ampliar la imagen en la posición del clic, usando porcentajes
        modalImg.style.transform = "scale(2)";
        modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`; // Zoom en la posición del clic
        modalImg.style.cursor = "zoom-out";
        modalImg.style.width = "1000px";
        isZoomed = true;
    }
}


// Cerrar modal al hacer clic fuera de la imagen
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }
}

document.getElementById('LimpiarButton1').addEventListener('click', function () {

    document.getElementById('filtroDeBusqueda').placeholder = "Elegir opción de búsqueda";

    // Ocultar las radiografías

    const elementos = document.getElementsByClassName("card-image");
    for (let i = 0; i < elementos.length; i++) {
        elementos[i].style.display = "none";
    }
    patientNameContainer.innerHTML = '';
})

