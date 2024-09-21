// Cargar el modelo
async function loadModel() {
    const model = await tf.loadGraphModel('/path/to/tfjs_model/model.json');
    return model;
}

// Realizar una inferencia
async function predict(model, input) {
    const tensor = tf.browser.fromPixels(input); // Ajusta según tu input
    const prediction = model.predict(tensor);
    prediction.print(); // O usa la salida como necesites
}

// Uso
loadModel().then(model => {
    const inputElement = document.getElementById('inputImage'); // Un elemento en tu HTML
    predict(model, inputElement);
});
