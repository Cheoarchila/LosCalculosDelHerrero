// =======================================
// LOS CÁLCULOS DEL HERRERO
// script.js
// Versión 3.0
// =======================================

// ---------------------
// NAVEGACIÓN
// ---------------------

function ocultarPantallas() {

    document.getElementById("pantallaInicio").style.display = "none";
    document.getElementById("pantallaAcanalado").style.display = "none";
    document.getElementById("pantalla90").style.display = "none";

}

function abrirAcanalado() {

    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display = "block";

}

function volverInicio() {

    ocultarPantallas();
    document.getElementById("pantallaInicio").style.display = "block";

}

function abrir90() {

    ocultarPantallas();
    document.getElementById("pantalla90").style.display = "block";

}

function volverAcanalado() {

    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display = "block";

}

// ---------------------
// LIMPIAR
// ---------------------

function limpiar90() {

    document.getElementById("medidaFinal").value = "";
    document.getElementById("divisiones").value = "";
    document.getElementById("profundidad").value = "";
    document.getElementById("bordes").value = "";
    document.getElementById("espesor").value = "";

    document.getElementById("anchoCanal").textContent = "-";
    document.getElementById("altoCanal").textContent = "-";
    document.getElementById("desarrollo").textContent = "-";

}

// ---------------------
// CALCULAR
// ---------------------

function calcular90() {

    const medidaFinal = parseFloat(document.getElementById("medidaFinal").value);
    const divisiones = parseInt(document.getElementById("divisiones").value);
    const profundidad = parseFloat(document.getElementById("profundidad").value);
    const bordes = parseFloat(document.getElementById("bordes").value);
    const espesor = parseFloat(document.getElementById("espesor").value);

    if (
        isNaN(medidaFinal) ||
        isNaN(divisiones) ||
        isNaN(profundidad) ||
        isNaN(bordes) ||
        isNaN(espesor)
    ) {

        alert("Complete todos los campos.");
        return;

    }

    // ======= CÁLCULO PROVISIONAL =======

    const anchoCanal = medidaFinal / divisiones;

    const altoCanal = profundidad;

    const desarrollo =
        medidaFinal +
        (profundidad * divisiones * 2) +
        (bordes * 2) -
        (espesor * divisiones * 2);

    // ================================

    document.getElementById("anchoCanal").textContent =
        Number(anchoCanal.toFixed(2));

    document.getElementById("altoCanal").textContent =
        Number(altoCanal.toFixed(2));

    document.getElementById("desarrollo").textContent =
        Number(desarrollo.toFixed(2));

}
