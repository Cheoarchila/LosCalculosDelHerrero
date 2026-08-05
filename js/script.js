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

function generarMarcas(anchoCanal,profundidad,bordes,espesor,canales,anchoPlancha){

    let horizontal=anchoCanal-(espesor*2);
    let vertical=profundidad-(espesor*2);

    let marcas=[];

    let numero=1;
    let marca=bordes-espesor;

    marcas.push({
        numero:numero,
        valor:Math.round(marca),
        tipo:"borde"
    });

    for(let i=1;i<=canales;i++){

        numero++;
        marca+=horizontal;

        marcas.push({
            numero:numero,
            valor:Math.round(marca),
            tipo:"horizontal"
        });

        if(i<canales){

            numero++;
            marca+=vertical;

            marcas.push({
                numero:numero,
                valor:Math.round(marca),
                tipo:"profundidad"
            });
            
        }

    }

    numero++;
    marca+=bordes-espesor;

    marcas.push({
        numero:numero,
        valor:Math.round(marca),
        tipo:"bordeFinal"
    });

   let cortes=[];
let corte=-1;
            
    for(let i=0;i<marcas.length;i++){

    if(
    marcas[i].tipo=="profundidad" &&
    marcas[i].valor<=anchoPlancha
){
    corte=i;
}

if(corte!=-1){
    cortes.push(corte);
}

}

  generarPlanchas(
    marcas,
    corte,
    horizontal,
    vertical,
    bordes,
    espesor
);
}

//-----------------------------------------
//-----------------------------------------
// GENERAR PLANCHAS
//-----------------------------------------

//-----------------------------------------
// AQUI COMIENZA LA FUNCION generarPlanchas()
//-----------------------------------------

function generarPlanchas(
    marcas,
    corte,
    horizontal,
    vertical,
    bordes,
    espesor
){

    let html="";

    let numeroPlancha=1;
 let numeroMarca=1;
let inicioPlancha=0;

    html+=`<h3>PLANCHA ${numeroPlancha}</h3>`;

    for(let i=0;i<marcas.length;i++){

       if(corte!=-1 && i==corte+1){

    numeroPlancha++;

    numeroMarca=1;

    html+=`
<br>
<hr>
<h3>PLANCHA ${numeroPlancha}</h3>
`;

}

let numero;
let medida;

if(i<=corte || corte==-1){
    numero=marcas[i].numero;
    medida=marcas[i].valor;

}else{

  if(numeroMarca==1){

    // El origen de cada nueva plancha será
    // la primera profundidad (empalme)

    inicioPlancha = marcas[i].valor - (vertical + espesor);

}

numero=numeroMarca++;
medida=marcas[i].valor-inicioPlancha;

}


        html+=`
<div>

<span style="display:inline-block;width:55px;text-align:right;font-family:Consolas,monospace;">
${numero}-)
</span>

<span style="display:inline-block;width:65px;text-align:right;font-family:Consolas,monospace;">
${medida}
${i==corte ? " <strong style='color:red;'>◄ CORTE</strong>" : ""}
</span>

</div>`;

    }

    document.getElementById("marcas").innerHTML=html;

}

//-----------------------------------------
// AQUI TERMINA LA FUNCION generarPlanchas()
//-----------------------------------------

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
