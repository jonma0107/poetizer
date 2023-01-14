// Variables
const btnGrabar = document.querySelector('#btn1');
const btnDetener = document.querySelector('#btn2');
const texto = document.querySelector('#text');

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
});

// Funciones

