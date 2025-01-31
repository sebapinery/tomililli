let botonTxt = document.getElementById("boton0");
let botonPlayPause = document.getElementById("boton1");
let boton2 = document.getElementById("boton2");
let boton3 = document.getElementById("boton3");
let boton4 = document.getElementById("boton4");
let boton5 = document.getElementById("boton5");
let botonGuardar = document.getElementById("boton6");
let boton7 = document.getElementById("boton7");
let boton8 = document.getElementById("boton8");
let boton9 = document.getElementById("boton9");
let boton10 = document.getElementById("boton10");
let controles = document.getElementById("seccionControles");

botonTxt.addEventListener("click", muestraTxt);
botonPlayPause.addEventListener("click", playPause);
boton2.addEventListener("click", selCanvas1);
boton3.addEventListener("click", selCanvas2);
boton4.addEventListener("click", selCanvas3);
boton5.addEventListener("click", selCanvas4);
botonGuardar.addEventListener("click", guardar);
boton7.addEventListener("click", masVelo);
boton8.addEventListener("click", menosVelo);
boton9.addEventListener("click", masTam);
boton10.addEventListener("click", menosTam);

if (
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)
) {
  //alert("You're using Mobile Device!!")
  controles.classList.toggle("controlesM");
  tamFuenteMult = 2;
}

function muestraTxt() {
  var x = document.getElementById("muestraTxt");
  x.className = x.className === "muestra" ? "" : "muestra";
}

function playPause() {
  for (let i = 0; i < track.length; i++) {
    if (track[i].sonido.isPlaying()) {
      track[i].sonido.pause();
      selectCanvas[6].state = false;
    } else {
      track[i].sonido.loop();
      selectCanvas[6].state = true;
    }
  }
}

function selCanvas1() {
  selectCanvas[0].state = true;
  selectCanvas[1].state = false;
  selectCanvas[2].state = false;
  selectCanvas[3].state = false;
  selectCanvas[5].state = true;
}
function selCanvas2() {
  selectCanvas[1].state = true;
  selectCanvas[0].state = false;
  selectCanvas[2].state = false;
  selectCanvas[3].state = false;
  selectCanvas[5].state = true;
}
function selCanvas3() {
  selectCanvas[2].state = true;
  selectCanvas[0].state = false;
  selectCanvas[1].state = false;
  selectCanvas[3].state = false;
  selectCanvas[5].state = true;
}
function selCanvas4() {
  selectCanvas[3].state = true;
  selectCanvas[0].state = false;
  selectCanvas[1].state = false;
  selectCanvas[2].state = false;
  selectCanvas[5].state = true;
}

function guardar() {
  selectCanvas[4].state = true;
}

function masVelo() {
  slider1 += 0.01;
}
function menosVelo() {
  slider1 -= 0.01;
}
function masTam() {
  slider2 += 0.5;
}
function menosTam() {
  slider2 -= 0.5;
}
