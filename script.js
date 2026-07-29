// ===============================
// LOS CÁLCULOS DEL HERRERO
// script.js
// Versión 2.0
// ===============================

//------------------------------
// INICIO
//------------------------------

function abrirAcanalado(){

    ocultarTodo();

    document.getElementById("pantallaAcanalado").style.display="block";

}

function volverInicio(){

    ocultarTodo();

    document.getElementById("pantallaInicio").style.display="block";

}

//------------------------------
// ACANALADO
//------------------------------

function abrir90(){

    ocultarTodo();

    document.getElementById("pantalla90").style.display="block";

}

function volverAcanalado(){

    ocultarTodo();

    document.getElementById("pantallaAcanalado").style.display="block";

}

//------------------------------
// OCULTAR TODAS LAS PANTALLAS
//------------------------------

function ocultarTodo(){

    document.getElementById("pantallaInicio").style.display="none";

    document.getElementById("pantallaAcanalado").style.display="none";

    document.getElementById("pantalla90").style.display="none";

}

//------------------------------
// ACANALADO 90°
//------------------------------

function calcular90(){

    const medidaFinal = parseFloat(document.getElementById("medidaFinal").value);
    const divisiones = parseInt(document.getElementById("divisiones").value);
    const profundidad = parseFloat(document.getElementById("profundidad").value);
    const bordes = parseFloat(document.getElementById("bordes").value);
    const espesor = parseFloat(document.getElementById("espesor").value);

    if(
        isNaN(medidaFinal) ||
        isNaN(divisiones) ||
        isNaN(profundidad) ||
        isNaN(bordes) ||
        isNaN(espesor)
    ){
        alert("Complete todos los datos.");
        return;
    }

    const anchoCanal = medidaFinal / divisiones;

    const altoCanal = profundidad;

    const desarrollo =
        medidaFinal +
        (profundidad * divisiones * 2) +
        (bordes * 2) -
        (espesor * divisiones * 2);

    document.getElementById("anchoCanal").textContent =
        anchoCanal.toFixed(2).replace(/\.00$/,"") + " mm";

    document.getElementById("altoCanal").textContent =
        altoCanal.toFixed(2).replace(/\.00$/,"") + " mm";

    document.getElementById("desarrollo").textContent =
        desarrollo.toFixed(2).replace(/\.00$/,"") + " mm";

}
    // ==========
    // CÁLCULO PROVISIONAL
    // (Lo cambiaremos por tu fórmula real)
    // ==========

    let anchoCanal = Math.round(medidaFinal/divisiones);

    let altoCanal = profundidad;

    let desarrollo = medidaFinal;

    document.getElementById("anchoCanal").innerHTML = anchoCanal + " mm";

    document.getElementById("altoCanal").innerHTML = altoCanal + " mm";

    document.getElementById("desarrollo").innerHTML = desarrollo + " mm";

}
