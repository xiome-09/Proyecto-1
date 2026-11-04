let registrosList = [];
let contadorId = 1;

const studentForm = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentsTable tbody');
const btnDownload = document.getElementById('btnDownload');
const fileInput = document.getElementById('fileInput');

// 1. Registro de estudiantes
studentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const nie = document.getElementById('nie').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const grado = document.getElementById('grado').value;
  const seccion = document.getElementById('seccion').value;
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();

  // Validación de campos vacíos
  if (!nombre || !nie || !edad || !grado || !seccion || !correo || !telefono) {
    alert('Por favor complete todos los campos.');
    return;
  }

  // Generación de código incremental (001, 002, ...)
  const codigo = String(contadorId).padStart(3, '0');

  // Formato del registro de texto delimitado por |
  const registroLinea = `${codigo}|${nombre}|${nie}|${edad}|${grado}|${seccion}|${correo}|${telefono}`;

  registrosList.push(registroLinea);
  contadorId++;

  agregarFilaTabla([codigo, nombre, nie, edad, grado, seccion, correo, telefono]);
  studentForm.reset();
});

// Función para insertar una nueva fila en el DOM
function agregarFilaTabla(datos) {
  const tr = document.createElement('tr');
  datos.forEach(campo => {
    const td = document.createElement('td');
    td.textContent = campo;
    tr.appendChild(td);
  });
  tableBody.appendChild(tr);
}

// 4. Reto 1: Descargar archivo TXT
btnDownload.addEventListener('click', function() {
  if (registrosList.length === 0) {
    alert('No hay registros para descargar.');
    return;
  }

  const contenido = registrosList.join('\n');
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const enlace = document.createElement('a');

  enlace.href = URL.createObjectURL(blob);
  enlace.download = 'estudiantes.txt';
  enlace.click();
  URL.revokeObjectURL(enlace.href);
});

// 5. Reto 2: Cargar y procesar archivo TXT
fileInput.addEventListener('change', function(e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function(e) {
    const contenido = e.target.result;
    const lineas = contenido.split(/\r?\n/);

    // Limpiar tabla e historial actual
    tableBody.innerHTML = '';
    registrosList = [];

    lineas.forEach(linea => {
      const lineaLimpia = linea.trim();
      if (lineaLimpia !== '') {
        registrosList.push(lineaLimpia);
        const campos = lineaLimpia.split('|');
        agregarFilaTabla(campos);
      }
    });

    // Actualizar el contador incremental al último ID procesado
    if (registrosList.length > 0) {
      const ultimoCodigo = parseInt(registrosList[registrosList.length - 1].split('|')[0], 10);
      if (!isNaN(ultimoCodigo)) {
        contadorId = ultimoCodigo + 1;
      }
    }
  };

  lector.readAsText(archivo);
});