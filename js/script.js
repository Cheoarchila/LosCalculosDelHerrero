// =======================================
// LOS CÁLCULOS DEL HERRERO
// Script.js
// =======================================

//-----------------------------------------
// NAVEGACIÓN
//-----------------------------------------

function ocultarPantallas(){

    document.getElementById("pantallaInicio").style.display="none";
    document.getElementById("pantallaAcanalado").style.display="none";
    document.getElementById("pantalla90").style.display="none";

}

function abrirAcanalado(){

    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display="block";

}

function volverInicio(){

    ocultarPantallas();
    document.getElementById("pantallaInicio").style.display="block";

}

function abrir90(){

    ocultarPantallas();
    document.getElementById("pantalla90").style.display="block";

}

function volverAcanalado(){

    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display="block";

}

//-----------------------------------------
// LIMPIAR
//-----------------------------------------

function limpiar90(){

    document.getElementById("medidaFinal").value=1000;
    document.getElementById("divisiones").value=3;
    document.getElementById("profundidad").value=15;
    document.getElementById("bordes").value=20;
    document.getElementById("espesor").value=1;

    document.getElementById("anchoCanal").innerHTML="-";
    document.getElementById("altoCanal").innerHTML="-";
    document.getElementById("desarrollo").innerHTML="-";

    validarCanales();

}

//-----------------------------------------
// CANALES
//-----------------------------------------

function validarCanales(){

    let canales=parseInt(document.getElementById("divisiones").value);

    let profundidad=document.getElementById("profundidad");

    if(canales==1){

        profundidad.value=0;
        profundidad.disabled=true;

    }else{

        profundidad.disabled=false;

    }

}

//-----------------------------------------
// CALCULAR
//-----------------------------------------

function calcular90(){

    let medida = parseFloat(document.getElementById("medidaFinal").value);
    let canales = parseInt(document.getElementById("divisiones").value);
    let profundidad = parseFloat(document.getElementById("profundidad").value);
    let bordes = parseFloat(document.getElementById("bordes").value);
    let espesor = parseFloat(document.getElementById("espesor").value);

    if(
        isNaN(medida) ||
        isNaN(canales) ||
        isNaN(bordes) ||
        isNaN(espesor)
    ){
        return;
    }

    if(canales < 1){
        canales = 1;
    }

    if(canales == 1){
        profundidad = 0;
        document.getElementById("profundidad").value = 0;
        document.getElementById("profundidad").disabled = true;
    }else{
        document.getElementById("profundidad").disabled = false;

        if(isNaN(profundidad)){
            profundidad = 0;
        }
    }

    let anchoCanal = medida / canales;

    let altoCanal = profundidad;

    let desarrollo =
        ((bordes * 2) +
        medida +
        ((canales - 1) * profundidad))
        -
        (canales * 4 * espesor);

    document.getElementById("anchoCanal").innerHTML =
        Math.round(anchoCanal);

    document.getElementById("altoCanal").innerHTML =
        Math.round(altoCanal);

    document.getElementById("desarrollo").innerHTML =
        Math.round(desarrollo);

    let html = "";

    let marca = bordes - espesor;

    html += "<div>" + Math.round(marca) + "</div>";

    let horizontal = anchoCanal - (espesor * 2);

    let vertical = profundidad - (espesor * 2);

    for(let i=1;i<=canales;i++){

        marca += horizontal;

        html += "<div>" + Math.round(marca) + "</div>";

        if(i<canales){

            marca += vertical;

            html += "<div>" + Math.round(marca) + "</div>";

        }

    }

    marca += bordes - espesor;

    html += "<div>" + Math.round(marca) + "</div>";

    document.getElementById("marcas").innerHTML = html;
    
}
window.onload=function(){

    limpiar90();

    document.getElementById("divisiones").addEventListener("input",validarCanales);

}
document.addEventListener("DOMContentLoaded", function () {

    const controles = [
        "medidaFinal",
        "divisiones",
        "profundidad",
        "bordes",
        "espesor"
    ];

    controles.forEach(function(id){

        document.getElementById(id).addEventListener("input", calcular90);

    });

    calcular90();

});
