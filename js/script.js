// =======================================
// LOS CÁLCULOS DEL HERRERO
// js/script.js
// PARTE 1
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

    calcular90();

}

function volverAcanalado(){

    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display="block";

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

    if(isNaN(medida) || isNaN(canales) || isNaN(bordes) || isNaN(espesor)){
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

    let desarrollo =
    ((bordes*2)+
    medida+
    ((canales-1)*profundidad))
    -
    (canales*4*espesor);

    document.getElementById("desarrollo").innerHTML=Math.round(desarrollo);

    document.getElementById("anchoCanal").innerHTML=Math.round(anchoCanal);

    //-----------------------------------------
    // MARCAS DE DOBLADO
    //-----------------------------------------

    let horizontal = anchoCanal - (espesor * 2);

    let vertical = profundidad - (espesor * 2);

    let marca = bordes - espesor;

    let html = "<div>"+Math.round(marca)+"</div>";

    for(let i=1;i<=canales;i++){

        marca += horizontal;

        html += "<div>"+Math.round(marca)+"</div>";

        if(i<canales){

            marca += vertical;

            html += "<div>"+Math.round(marca)+"</div>";

        }

    }

    marca += bordes - espesor;

    html += "<div>"+Math.round(marca)+"</div>";

    document.getElementById("marcas").innerHTML = html;

}

//-----------------------------------------
// EVENTOS
//-----------------------------------------

document.addEventListener("DOMContentLoaded",function(){

    const controles=[

        "medidaFinal",
        "divisiones",
        "profundidad",
        "bordes",
        "espesor"

    ];

    controles.forEach(function(id){

        document.getElementById(id).addEventListener("input",calcular90);

    });

    calcular90();

});


