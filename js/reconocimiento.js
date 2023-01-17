// Variables
let DB;
const btnGrabar = document.querySelector('#btn1');
const btnDetener = document.querySelector('#btn2');
const texto = document.querySelector('#text');

const btnLeer = document.querySelector('#btn3');
const btnDescargar = document.querySelector('#btn4');

let recognition = new webkitSpeechRecognition();
recognition.lang = 'es-MX, en-US';
recognition.continuous = true;
recognition.interimResults = false;

// Objeto para almacenar la info de la base de datos
const poemaObj = {
  poema: ''
};


// Eventos

document.addEventListener('DOMContentLoaded', () => {
  crearBD();
  if (window.indexedDB.open('bd', 1)) {
    mantenerPoema();
  }
});

recognition.onresult = (e) => {
  // const res = e.results[0][0].transcript;
  const res = e.results;
  const frase = res[res.length - 1][0];
  const { transcript } = frase
  texto.value += transcript + '\n';
  agregarValor(texto.value);
  swal('Verso grabado!', 'Si quieres seguir grabando otro verso dále en el botón azul!')
}

btnGrabar.addEventListener('click', () => {
  recognition.start();
//   recognition.continuous = true;
});

btnDetener.addEventListener('click', () => {
  crearPoema();
  recognition.stop();
  swal("Buen trabajo!", "El micrófono ha dejado de grabar.", "success");  
});

btnLeer.addEventListener('click', () => {
  leerTexto(texto.value)
});

btnDescargar.addEventListener('click', () => {
  descargarTxt(texto.value)
});

/*************************************************************  BASE DE DATOS  ****************************************************/

function crearBD() {
  // definir la version 1.0
  const crearBD = window.indexedDB.open('bd', 1);

  crearBD.onerror = () => {
    console.log('hubo un error');
  }

  crearBD.onsuccess = () => {
    console.log('base de datos creada');
    DB = crearBD.result;

    console.log(DB);
  }

  // definir el schema
  crearBD.onupgradeneeded = (e) => {
    const db = e.target.result;
    // le pasamos la base de datos y la configuración
    const objectStore = db.createObjectStore('bd', {
      keyPath: 'id',
      autoIncrement: true
    });

    //definir columnas
    objectStore.createIndex('poema', 'poema', { unique: false });

    console.log('base lista');
  }

} // fin crearBD

/********************************************************  FUNCIONES  *************************************************************/

function leerTexto(txt) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = txt;
  let selectedVoice = speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('es-MX') && voice.name.startsWith('Google'))[0];
  speech.voice = selectedVoice;
  speech.volume = 1;
  speech.rate = 1;
  
  window.speechSynthesis.speak(speech)
}

/*************************************************************/

function descargarTxt(params) {
  const doc = new jsPDF();

  let styles = {
    fontSize: 12,
    font: "helvetica",
    cellPadding: 8,    
    textAlign: "justify"
  };

  let margins = {
    top: 10,
    left: 20,
    right: 20
  };

  doc.autoTable({
    head: [['Contenido del poema']],
    styles: styles,
    margin: margins,
    pageBreak: "auto",
    tableLineWidth: "auto",
    body: [[texto.value]],
  });

  doc.save('poema.pdf');
  
};

/*************************************************************/

function crearPoema() {

  const conectarBD = window.indexedDB.open('bd', 1)

  conectarBD.onsuccess = () => {
    DB = conectarBD.result;
    const transaction = DB.transaction(['bd'], 'readwrite')

    const objectStore = transaction.objectStore('bd');

    objectStore.add(poemaObj)

    objectStore.openCursor(null, 'prev').onsuccess = function (e) {
      const cursor = e.target.result;
      poemaObj.poema = cursor.value.poema
      console.log(cursor);
    }; // fin openCursor
  }; // fin conectarBD
}; // fin función crearPoema

/*************************************************************/

function agregarValor(valor) {
  poemaObj.poema = valor;
};

/*************************************************************/

function mantenerPoema() {
  const conectarBD = window.indexedDB.open('bd', 1)

  conectarBD.onsuccess = () => {
    DB = conectarBD.result;
    const transaction = DB.transaction(['bd'], 'readwrite')

    const objectStore = transaction.objectStore('bd');

    objectStore.openCursor(null, 'prev').onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        const { poema } = cursor.value
        texto.textContent = poema
//         console.log(cursor.value.poema);
      } // fin if
    }

  };

}; // fin función mantenerPoema
