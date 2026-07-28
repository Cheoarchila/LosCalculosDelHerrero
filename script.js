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

    let medidaFinal = Number(document.getElementById("medidaFinal").value);

    let divisiones = Number(document.getElementById("divisiones").value);

    let profundidad = Number(document.getElementById("profundidad").value);

    let bordes = Number(document.getElementById("bordes").value);

    let espesor = Number(document.getElementById("espesor").value);

    if(
        medidaFinal<=0 ||
        divisiones<=0 ||
        profundidad<=0 ||
        bordes<0 ||
        espesor<=0
    ){

        alert("Complete todos los datos.");

        return;

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
