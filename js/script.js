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
// ANCHO DE PLANCHA
//-----------------------------------------

function editarPlancha(){

    let campo=document.getElementById("anchoPlancha");

    if(campo.readOnly){

        campo.readOnly=false;
        campo.focus();
        campo.select();

    }else{

        campo.readOnly=true;
        calcular90();

    }

}

//-----------------------------------------
// CALCULAR
//-----------------------------------------

function calcular90(){

let anchoPlancha=parseFloat(document.getElementById("anchoPlancha").value);
    let medida = parseFloat(document.getElementById("medidaFinal").value);
    let canales = parseInt(document.getElementById("divisiones").value);
    let profundidad = parseFloat(document.getElementById("profundidad").value);
    let bordes = parseFloat(document.getElementById("bordes").value);
    let espesor = parseFloat(document.getElementById("espesor").value);

    if(
    isNaN(anchoPlancha) ||
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

}else{

    if(isNaN(profundidad)){
        profundidad = 15;
    }

}

    let anchoCanal = medida / canales;

    let desarrollo =
    ((bordes*2)+
    medida+
    ((canales-1)*profundidad))
    -
    (canales*4*espesor);

    mostrarResultados(desarrollo,anchoCanal);
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

//-----------------------------------------
// BUSCAR PUNTO DE CORTE
//-----------------------------------------

let puntoCorte = -1;
let marcaCorte = 0;

let elementos = html.match(/>([0-9]+)</g);

if(elementos){

    for(let i=0;i<elementos.length;i++){

        let valor=parseInt(elementos[i].replace(">","").replace("<",""));

        if((i+1)%2!=0 && valor<=anchoPlancha){

            puntoCorte=i+1;
            marcaCorte=valor;

        }

    }

}

console.log("Punto de corte:",puntoCorte,"Marca:",marcaCorte);
    
    document.getElementById("marcas").innerHTML = html;

}

//-----------------------------------------
// MOSTRAR RESULTADOS
//-----------------------------------------

function mostrarResultados(desarrollo,anchoCanal){

    document.getElementById("desarrollo").innerHTML=Math.round(desarrollo);

    document.getElementById("anchoCanal").innerHTML=Math.round(anchoCanal);

}

//-----------------------------------------
// GENERAR MARCAS
//-----------------------------------------

function generarMarcas(anchoCanal,profundidad,bordes,espesor,canales,anchoPlancha){

    let horizontal=anchoCanal-(espesor*2);
    let vertical=profundidad-(espesor*2);

    let marca=bordes-espesor;

    let html="<div>"+Math.round(marca)+"</div>";

    for(let i=1;i<=canales;i++){

        marca+=horizontal;

        html+="<div>"+Math.round(marca)+"</div>";

        if(i<canales){

            marca+=vertical;

            html+="<div>"+Math.round(marca)+"</div>";

        }

    }

    marca+=bordes-espesor;

    html+="<div>"+Math.round(marca)+"</div>";

    document.getElementById("marcas").innerHTML=html;

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
        document.getElementById(id).addEventListener("change",calcular90);
    });

    function actualizarProfundidad(){

        let canales=parseInt(document.getElementById("divisiones").value);

        let fila=document.getElementById("filaProfundidad");
        let mensaje=document.getElementById("mensajeProfundidad");
        let profundidad=document.getElementById("profundidad");

        if(canales==1){

            fila.style.display="none";
            mensaje.style.display="flex";
            profundidad.disabled=true;

        }else{

            fila.style.display="flex";
            mensaje.style.display="none";
            profundidad.disabled=false;

        }

    }

    document.getElementById("divisiones").addEventListener("change",function(){

        actualizarProfundidad();
        calcular90();

    });

    actualizarProfundidad();
    calcular90();

});
