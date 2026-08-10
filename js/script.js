// =======================================
// LOS CÁLCULOS DEL HERRERO
// js/script.js
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
    
    // Forzar cálculo cuando se abre la pantalla
    setTimeout(function(){
        actualizarProfundidad();
        calcular90();
    }, 50);
}

function volverAcanalado(){
    ocultarPantallas();
    document.getElementById("pantallaAcanalado").style.display="block";
}

//-----------------------------------------
// ANCHO DE PLANCHA
//-----------------------------------------

function editarPlancha(){
    let campo = document.getElementById("anchoPlancha");

    if(campo.readOnly){
        campo.readOnly = false;
        campo.focus();
        campo.select();
    }else{
        campo.readOnly = true;
        calcular90();
    }
}

//-----------------------------------------
// ACTUALIZAR PROFUNDIDAD
//-----------------------------------------

function actualizarProfundidad(){
    let canales = parseInt(document.getElementById("divisiones").value);
    let fila = document.getElementById("filaProfundidad");
    let mensaje = document.getElementById("mensajeProfundidad");
    let profundidad = document.getElementById("profundidad");

    if(canales == 1){
        fila.classList.add("oculto");
        mensaje.classList.remove("oculto");
        profundidad.disabled = true;
    }else{
        fila.classList.remove("oculto");
        mensaje.classList.add("oculto");
        profundidad.disabled = false;
    }
}

//-----------------------------------------
// CALCULAR
//-----------------------------------------

function calcular90(){
    let anchoPlancha = parseFloat(document.getElementById("anchoPlancha").value);
    let medida = parseFloat(document.getElementById("medidaFinal").value);
    let canales = parseInt(document.getElementById("divisiones").value);
    let profundidad = parseFloat(document.getElementById("profundidad").value);
    let bordes = parseFloat(document.getElementById("bordes").value);
    let espesor = parseFloat(document.getElementById("espesor").value);

    // Validación
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

    // Mostrar resultados
    document.getElementById("desarrollo").innerHTML = Math.round(desarrollo) + " mm";
    document.getElementById("anchoCanal").innerHTML = Math.round(anchoCanal) + " mm";

    // Generar marcas
    generarMarcas(
        anchoCanal,
        profundidad,
        bordes,
        espesor,
        canales,
        anchoPlancha,
        desarrollo
    );
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
    anchoPlancha,
    desarrollo
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

    // Generar planchas
    generarPlanchas(
        marcas,
        horizontal,
        vertical,
        bordes,
        espesor,
        anchoPlancha,
        profundidad
    );
}

//-----------------------------------------
// GENERAR PLANCHAS
//-----------------------------------------

function generarPlanchas(
    marcas,
    horizontal,
    vertical,
    bordes,
    espesor,
    anchoPlancha,
    profundidad
){
    let html = "";
    let inicio = 0;
    let numeroPlancha = 1;

    while(inicio < marcas.length){
        let esPrimera = numeroPlancha === 1;

        let posicion =
            esPrimera
            ? bordes - 1
            : profundidad - 1;

        let indices = [inicio];
        let posiciones = [posicion];

        let ultimoIndice = inicio;

        for(let i = inicio + 1; i < marcas.length; i++){
            let distancia =
                marcas[i].valor -
                marcas[i - 1].valor;

            let nuevaPosicion =
                posicion + distancia;

            // ÚLTIMA MARCA DE LA PIEZA
            if(i === marcas.length - 1){
                indices.push(i);
                posiciones.push(bordes - 1);
                ultimoIndice = i;
                break;
            }

            // LA MARCA CABE
            if(nuevaPosicion <= anchoPlancha){
                posicion = nuevaPosicion;
                indices.push(i);
                posiciones.push(posicion);
                ultimoIndice = i;
            }else{
                break;
            }
        }

        // MOSTRAR PLANCHA
        html += `<h3>PLANCHA ${numeroPlancha}</h3>`;

        for(let j = 0; j < indices.length; j++){
            let indice = indices[j];

            html += `
            <div style="
                display:flex;
                align-items:center;
                white-space:nowrap;
                font-family:Consolas,monospace;
            ">
                <span style="
                    display:inline-block;
                    width:55px;
                    text-align:right;
                ">
                    ${marcas[indice].numero}-)
                </span>

                <span style="
                    display:inline-block;
                    width:80px;
                    text-align:right;
                    margin-left:8px;
                ">
                    ${Math.round(posiciones[j])}
                </span>

                ${
                    j === indices.length - 1
                    ? `<span style="
                            margin-left:10px;
                            color:red;
                            font-weight:bold;
                        ">◄ CORTE</span>`
                    : ""
                }
            </div>
            `;
        }

        // ¿TERMINÓ LA PIEZA?
        if(ultimoIndice === marcas.length - 1){
            break;
        }

        // SIGUIENTE PLANCHA
        inicio = ultimoIndice + 1;
        numeroPlancha++;
    }

    document.getElementById("marcas").innerHTML = html;
}

//-----------------------------------------
// EVENTOS
//-----------------------------------------

document.addEventListener("DOMContentLoaded", function(){
    // Agregar listeners a todos los inputs
    const controles = [
        "anchoPlancha",
        "medidaFinal",
        "divisiones",
        "profundidad",
        "bordes",
        "espesor"
    ];

    controles.forEach(function(id){
        const elemento = document.getElementById(id);
        if(elemento){
            elemento.addEventListener("change", function(){
                actualizarProfundidad();
                calcular90();
            });
            elemento.addEventListener("input", function(){
                actualizarProfundidad();
                calcular90();
            });
        }
    });
});
