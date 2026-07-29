// =======================================
// LOS CÁLCULOS DEL HERRERO
// script.js
// =======================================

//------------------------------
// NAVEGACIÓN
//------------------------------

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

//------------------------------
// LIMPIAR
//------------------------------

function limpiar90(){

    document.getElementById("medidaFinal").value="";
    document.getElementById("divisiones").value="";
    document.getElementById("profundidad").value="";
    document.getElementById("bordes").value="";
    document.getElementById("espesor").value="";

    document.getElementById("anchoCanal").textContent="-";
    document.getElementById("altoCanal").textContent="-";
    document.getElementById("desarrollo").textContent="-";

}

//------------------------------
// CALCULAR
//------------------------------

function calcular90(){

    const medidaFinal=parseFloat(document.getElementById("medidaFinal").value);
    const divisiones=parseInt(document.getElementById("divisiones").value);
    const profundidad=parseFloat(document.getElementById("profundidad").value);
    const bordes=parseFloat(document.getElementById("bordes").value);
    const espesor=parseFloat(document.getElementById("espesor").value);

    if(
        isNaN(medidaFinal)||
        isNaN(divisiones)||
        isNaN(profundidad)||
        isNaN(bordes)||
        isNaN(espesor)
    ){

        alert("Complete todos los datos.");
        return;

    }

    const anchoCanal=medidaFinal/divisiones;

    const altoCanal=profundidad;

    const desarrollo=
        medidaFinal+
        (profundidad*divisiones*2)+
        (bordes*2)-
        (espesor*divisiones*2);

    document.getElementById("anchoCanal").textContent=
        anchoCanal.toFixed(2);

    document.getElementById("altoCanal").textContent=
        altoCanal;

    document.getElementById("desarrollo").innerHTML=
        desarrollo.toFixed(2)+
        "<br><br><b>Marcas:</b><br>"+
        calcularMarcas(
            medidaFinal,
            divisiones,
            profundidad,
            bordes,
            espesor
        );

}

//------------------------------
// MARCAS
//------------------------------

function calcularMarcas(
    medidaFinal,
    divisiones,
    profundidad,
    bordes,
    espesor
){

    const ancho=Math.floor(medidaFinal/divisiones);

    let posicion=bordes-espesor;

    let texto=posicion.toFixed(2)+" mm";

    for(let i=1;i<=divisiones;i++){

        posicion+=ancho-(espesor*2);

        texto+="<br>"+posicion.toFixed(2)+" mm";

        if(i<divisiones){

            posicion+=profundidad-(espesor*2);

            texto+="<br>"+posicion.toFixed(2)+" mm";

        }

    }

    return texto;

}
