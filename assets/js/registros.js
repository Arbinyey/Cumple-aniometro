// Asegúrate de que este código esté en un archivo JavaScript vinculado a tu registros.html
document.addEventListener('DOMContentLoaded', () => {
    mostrarFuncionarios();
});

function mostrarFuncionarios() {
    const request = window.indexedDB.open('FuncionariosDB', 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('funcionarios', 'readonly');
        const objectStore = transaction.objectStore('funcionarios');
        const cursorRequest = objectStore.openCursor();

        const tbody = document.querySelector('#tablaFuncionarios tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de mostrar los registros actualizados

        cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const { nombre, fechaNacimiento, area, cargo } = cursor.value;
                const fila = tbody.insertRow();
                fila.insertCell().textContent = nombre;
                fila.insertCell().textContent = fechaNacimiento;
                fila.insertCell().textContent = area;
                fila.insertCell().textContent = cargo;

                const celdaAcciones = fila.insertCell();
                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'Eliminar';
                botonEliminar.classList.add('eliminar');
                botonEliminar.onclick = function() {
                    eliminarFuncionario(cursor.primaryKey, db);
                };
                celdaAcciones.appendChild(botonEliminar);

                cursor.continue();
            }
        };
    };

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event);
    };
}

function eliminarFuncionario(id, db) {
    const transaction = db.transaction('funcionarios', 'readwrite');
    const objectStore = transaction.objectStore('funcionarios');
    objectStore.delete(id);

    transaction.oncomplete = () => {
        mostrarFuncionarios(); // Actualizar la tabla después de eliminar un registro
    };
}

// Función para obtener los datos de los empleados de la tabla
function obtenerDatosDeEmpleados() {
    const empleados = [];
    const filas = document.querySelectorAll("#tablaFuncionarios tbody tr");

    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        const empleado = {
            nombre: celdas[0].textContent,
            fechaNacimiento: celdas[1].textContent,
            area: celdas[2].textContent,
            cargo: celdas[3].textContent
        };
        empleados.push(empleado);
    });

    return empleados;
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

// Ejemplo de uso
const empleados = obtenerDatosDeEmpleados();
console.log(empleados); // Imprime la lista de empleados obtenida de la tabla
