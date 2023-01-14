// Variables
const btnGrabar = document.querySelector('#btn1');
const btnDetener = document.querySelector('#btn2');
const texto = document.querySelector('#text');

const btnLeer = document.querySelector('#btn3');

let recognition = new webkitSpeechRecognition();
recognition.lang = 'es-ES, en-US';
recognition.continuous = true;
recognition.interimResults = false;


// Eventos

recognition.onresult = (e) => {
  // const res = e.results[0][0].transcript;
  const res = e.results;
  const frase = res[res.length - 1][0].transcript;
  texto.value += frase;
}

btnGrabar.addEventListener('click', () => {
  recognition.start();
});

btnDetener.addEventListener('click', () => {
  recognition.abort();
  swal("Buen trabajo!", "El microfono ha dejado de grabar.", "success");
});

// Funciones

function leerTexto(txt) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = txt;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech)

}

