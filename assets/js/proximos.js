// proximos.js

let db;

document.addEventListener('DOMContentLoaded', () => {
    abrirDB();
    document.getElementById('monthSelect').addEventListener('change', mostrarCumpleaniosPorMes);
});

function abrirDB() {
    const request = window.indexedDB.open('FuncionariosDB', 1);

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event);
    };
}
// Continuación de proximos.js

function mostrarCumpleaniosPorMes() {
    const mesSeleccionado = parseInt(document.getElementById('monthSelect').value) - 1; // -1 porque los meses en JS van de 0 a 11
    const transaction = db.transaction('funcionarios', 'readonly');
    const objectStore = transaction.objectStore('funcionarios');
    const cursorRequest = objectStore.openCursor();
    const listaCumpleanios = document.getElementById('birthdayList');

    listaCumpleanios.innerHTML = ''; // Limpiar la lista antes de añadir nuevos elementos

    cursorRequest.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            const empleado = cursor.value;
            const fechaNacimiento = new Date(empleado.fechaNacimiento);
            if (fechaNacimiento.getMonth() === mesSeleccionado) {
                const li = document.createElement('li');
                li.textContent = `${empleado.nombre} - ${empleado.fechaNacimiento}`;
                listaCumpleanios.appendChild(li);
            }
            cursor.continue();
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarCumpleañosHoy();
    document.getElementById('monthSelect').addEventListener('change', function() {
        mostrarCumpleañosDelMes(this.value);
    });
});

function mostrarCumpleañosHoy() {
    const request = window.indexedDB.open('FuncionariosDB', 1);
    const { dia, mes, ano } = obtenerFechaActual();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('funcionarios', 'readonly');
        const objectStore = transaction.objectStore('funcionarios');
        const cursorRequest = objectStore.openCursor();

        const listaHoy = document.getElementById('todayBirthdayList');
        listaHoy.innerHTML = ''; // Limpiar la lista

        cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const { nombre, fechaNacimiento } = cursor.value;
                const [anoNac, mesNac, diaNac] = fechaNacimiento.split('-').map(num => parseInt(num, 10));

                // Comprobar si el cumpleaños es hoy
                if (diaNac === dia && mesNac === mes) {
                    const item = document.createElement('li');
                    item.textContent = `${nombre} - ${fechaNacimiento}`;
                    listaHoy.appendChild(item);
                }

                cursor.continue();
            } else {
                // Si no hay cumpleaños hoy, mostrar un mensaje
                if (!listaHoy.firstChild) {
                    listaHoy.innerHTML = '<li>No hay cumpleaños hoy.</li>';
                }
            }
        };
    };

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event);
    };
}


document.addEventListener('DOMContentLoaded', () => {
    mostrarFechaActual();
    mostrarCumpleañosHoy();
});


function obtenerFechaActual() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth() + 1; // getMonth() devuelve un índice basado en cero, por lo que se suma 1
    const ano = hoy.getFullYear();

    return { dia, mes, ano };
}

