// Asegúrate de que este código esté en un archivo JavaScript vinculado a tu index.html
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formularioFuncionario'); // Asegúrate de que este ID coincida con tu formulario

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const funcionario = {
            nombre: document.getElementById('nombre').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            area: document.getElementById('area').value,
            cargo: document.getElementById('cargo').value
        };

        agregarFuncionario(funcionario);
    });
});

function agregarFuncionario(funcionario) {
    const request = window.indexedDB.open('FuncionariosDB', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('funcionarios')) {
            db.createObjectStore('funcionarios', { autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('funcionarios', 'readwrite');
        const objectStore = transaction.objectStore('funcionarios');
        objectStore.add(funcionario);
    };

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event);
    };
}

cursorRequest.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
        const { nombre, fechaNacimiento, area, cargo } = cursor.value;
        const fila = tbody.insertRow();

        fila.insertCell().textContent = nombre;

        // Convertir la fechaNacimiento a formato "día, mes, año"
        const fecha = new Date(fechaNacimiento);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        fila.insertCell().textContent = fecha.toLocaleDateString('es-ES', opciones);

        fila.insertCell().textContent = area;
        fila.insertCell().textContent = cargo;

        // Resto del código para manejar las acciones...
    }
};
