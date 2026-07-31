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

    document.getElementById("medidaFinal").value = 1000;
    document.getElementById("divisiones").value = 3;
    document.getElementById("profundidad").value = 15;
    document.getElementById("bordes").value = 20;
    document.getElementById("espesor").value = 1;

    validarCanales();

    calcular90();

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

    let medida=parseFloat(document.getElementById("medidaFinal").value);

    let canales=parseInt(document.getElementById("divisiones").value);

    let profundidad=parseFloat(document.getElementById("profundidad").value);

    let bordes=parseFloat(document.getElementById("bordes").value);

    let espesor=parseFloat(document.getElementById("espesor").value);

    if(

        isNaN(medida) ||
        isNaN(canales) ||
        isNaN(profundidad) ||
        isNaN(bordes) ||
        isNaN(espesor)

    ){

        alert("Complete todos los datos.");
        return;

    }

    let anchoCanal=medida/canales;

    let altoCanal=profundidad;

    let desarrollo=

    ((bordes*2)+
    medida+
    ((canales-1)*profundidad))
    -
    (canales*4*espesor);

    document.getElementById("anchoCanal").innerHTML=anchoCanal.toFixed(2)+" mm";

    document.getElementById("altoCanal").innerHTML=altoCanal.toFixed(2)+" mm";

    document.getElementById("desarrollo").innerHTML=desarrollo.toFixed(2)+" mm";

}

window.onload=function(){

    limpiar90();

    document.getElementById("divisiones").addEventListener("input",validarCanales);

}
