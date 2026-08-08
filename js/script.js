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

generarMarcas(
    anchoCanal,
    profundidad,
    bordes,
    espesor,
    canales,
    anchoPlancha
);
    
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

function generarMarcas(
    anchoCanal,
    profundidad,
    bordes,
    espesor,
    canales,
    anchoPlancha
){

    let horizontal = anchoCanal - (espesor * 2);
    let vertical = profundidad - (espesor * 2);

    let marcas = [];

    let numero = 1;
    let marca = bordes - espesor;

    // BORDE INICIAL
    marcas.push({
        numero: numero,
        valor: Math.round(marca),
        tipo: "borde"
    });

    // CANALES Y PROFUNDIDADES
    for(let i = 1; i <= canales; i++){

        numero++;
        marca += horizontal;

        marcas.push({
            numero: numero,
            valor: Math.round(marca),
            tipo: "horizontal"
        });

        if(i < canales){

            numero++;
            marca += vertical;

            marcas.push({
                numero: numero,
                valor: Math.round(marca),
                tipo: "profundidad"
            });

        }
    }

    // BORDE FINAL
    numero++;
    marca += bordes - espesor;

    marcas.push({
        numero: numero,
        valor: Math.round(marca),
        tipo: "bordeFinal"
    });

    // BUSCAR EL ÚLTIMO VERTICAL
    // QUE CABE EN LA PRIMERA PLANCHA

   let corte = -1;

let desarrolloFinal = marcas[marcas.length - 1].valor;

if(desarrolloFinal > anchoPlancha){

    for(let i = 0; i < marcas.length; i++){

        if(
            marcas[i].tipo == "profundidad" &&
            marcas[i].valor <= anchoPlancha
        ){

            corte = i;

        }

    }

}

    generarPlanchas(
        marcas,
        corte,
        horizontal,
        vertical,
        bordes,
        espesor,
        anchoPlancha
    );

}

//-----------------------------------------
// GENERAR PLANCHAS
//-----------------------------------------

function generarPlanchas(
    marcas,
    corte,
    horizontal,
    vertical,
    bordes,
    espesor,
    anchoPlancha
){

    let html = "";

    let prueba = calcularUnaPlancha(
        horizontal,
        vertical,
        bordes,
        true,
        anchoPlancha
    );

    alert(prueba.marcas.join(" - "));

    html += `<h3>PLANCHA 1</h3>`;

   for(
    let i = 0;
    i < marcas.length && (corte == -1 || i <= corte);
    i++
){
        html += `
        <div>

            <span style="
                display:inline-block;
                width:55px;
                text-align:right;
                font-family:Consolas,monospace;
            ">
                ${marcas[i].numero}-)
            </span>

            <span style="
                display:inline-block;
                width:65px;
                text-align:right;
                font-family:Consolas,monospace;
            ">
               ${marcas[i].valor}
${
    i == corte
    ? " <strong style='color:red;'>◄ CORTE AQUÍ</strong>"
    : ""
}
            </span>

        </div>
        `;

    }

    document.getElementById("marcas").innerHTML = html;

}

function calcularUnaPlancha(
    horizontal,
    vertical,
    borde,
    esPrimera,
    anchoPlancha
){

    let plancha=[];
    let marca;

    if(esPrimera){
        marca=borde-1;
    }else{
        marca=vertical+1;
    }

    plancha.push(marca);

    let corte=-1;
    let usarHorizontal=true;

    while(true){

        if(usarHorizontal){

            marca+=horizontal;

            // Si el horizontal ya no cabe,
            // terminamos la plancha.
            if(marca>anchoPlancha){
                break;
            }

            plancha.push(marca);

        }else{

            marca+=vertical;

            // Si el vertical ya no cabe,
            // no lo guardamos.
            if(marca>anchoPlancha){
                break;
            }

            plancha.push(marca);

            // Este es el último vertical
            // que cabe en la plancha.
            corte=plancha.length-1;
        }

        usarHorizontal=!usarHorizontal;
    }

    return{
        marcas:plancha,
        corte:corte,
        consumido:marca
    };

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
