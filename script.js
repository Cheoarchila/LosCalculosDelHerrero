// Variables globales de respaldo (valores iniciales por defecto)
let ultimaMedidaPlancha = 1200;
let ultimaMedidaFinal = 1000;
let ultimaProfundidad = 15;
let ultimoBorde = 20;
let ultimoCanalCantidad = 3;
let ultimoEspesor = 1;

// Control de navegación entre pantallas (TU CÓDIGO ORIGINAL INTACTO)
function abrirPantalla(idPantalla) {
    document.querySelectorAll('section').forEach(seccion => {
        seccion.classList.add('oculto');
    });
    document.getElementById(idPantalla).classList.remove('oculto');
}

// Lógica de cálculo matemático exacta
function calcular() {
    const anchoPlancha = Number(document.getElementById("anchoPlancha").value);
    const medidaFinal = Number(document.getElementById("medidaFinal").value);
    const canales = Number(document.getElementById("canales").value);
    const inputProfundidad = document.getElementById("profundidad");
    const bordes = Number(document.getElementById("bordes").value);
    const espesor = Number(document.getElementById("espesor").value);

    // NUEVO: Si canales es 1, la profundidad interna es 1 para no romper tus fórmulas
    let profundidad = Number(inputProfundidad.value);
    if (canales === 1) {
        profundidad = 1;
    }

    // Cálculos estructurales
    const anchoCanal = medidaFinal / canales;
    const altoCanal = profundidad;

    // Fórmula de desarrollo original provista por ti
    const desarrollo = (bordes * 2) + medidaFinal + ((canales - 1) * profundidad) - (canales * 4 * espesor) + ((canales - 1) * espesor);
    
    document.getElementById("anchoCanal").textContent = Math.round(anchoCanal);
    document.getElementById("altoCanal").textContent = Math.round(altoCanal);
    document.getElementById("desarrollo").textContent = Math.round(desarrollo);

    // --- Ciclo de Generación de Marcas ---
    let marca = bordes - espesor;
    let contador = 1;

    const altoReducido = profundidad - (2 * espesor);
    let marcasArray = [];
    
    marcasArray.push({ num: contador++, valor: Math.round(marca), control: null });

    let controlAcumulado = 0;
    
    for (let c = 1; c <= canales; c++) {
        if (c % 2 !== 0) {
            marca += (anchoCanal - (2 * espesor));
        } else {
            marca += anchoCanal;
        }
        
        marcasArray.push({ num: contador++, valor: Math.round(marca), control: null });

        if (c < canales) {
            marca += altoReducido;
            controlAcumulado += anchoCanal;
            marcasArray.push({ num: contador++, valor: Math.round(marca), control: Math.round(controlAcumulado) });
        }
    }

    marca += (bordes - espesor);
    marcasArray.push({ num: contador, valor: Math.round(marca), control: null });

        // --- PROCESAMIENTO CÍCLICO DE PLANCHAS CORREGIDO ---
    let bloquesPlanchas = [];
    let i = 0;
    let valorPestañaReducida = profundidad - (2 * espesor);

    // Ajustamos el encabezado agregando una columna vacía en medio para mantener la alineación fija de las 3 columnas
    const encabezadoColumnas = "<div class='fila-marca'><span class='col-encabezado'>MARCAS</span><span class='col-espacio-corte'></span><span class='col-encabezado'>CONTROL</span></div>";

    while (i < marcasArray.length) {
        let esUltima = true;
        let marcaBaseInicioTramo = marcasArray[i].valor;
        let temporalContador = 1;
        let lineasMarcas = [];
        let indiceCorteEnEsteTramo = -1;

        // Buscamos punto de corte proyectado basándonos en longitudes acumuladas reales
        for (let j = i + 1; j < marcasArray.length; j++) {
            let medidaProyectadaDesdeCero = (bloquesPlanchas.length === 0) ? 
                marcasArray[j].valor : 
                (valorPestañaReducida + (marcasArray[j].valor - marcaBaseInicioTramo));
            
            if (medidaProyectadaDesdeCero > anchoPlancha) {
                let posibleIndiceCorte = j - 1;
                // Forzar corte en paso impar para garantizar doblado estructural óptimo
                if (marcasArray[posibleIndiceCorte].num % 2 === 0) {
                    posibleIndiceCorte--;
                }
                if (posibleIndiceCorte >= i) {
                    indiceCorteEnEsteTramo = posibleIndiceCorte;
                    esUltima = false;
                }
                break;
            }
        }

        if (bloquesPlanchas.length === 0) {
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            for (let k = i; k <= finImpresion; k++) {
                // Generamos la celda central: si es corte dibuja el cartel apuntando a marcas, si no, se queda en blanco
                let celdaCorte = (k === indiceCorteEnEsteTramo) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
                let textoMarca = marcasArray[k].num + ".-) " + marcasArray[k].valor;
                let textoControl = (marcasArray[k].control !== null) ? marcasArray[k].control : "";

                lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + textoMarca + "</span>" + celdaCorte + "<span class='col-datos col-control'>" + textoControl + "</span></div>");
            }
            i = finImpresion; 
        } else {
            // Planchas siguientes: La primera marca física es la pestaña de acople (reducida)
            lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + temporalContador + ".-) " + Math.round(valorPestañaReducida) + "</span><span class='col-espacio-corte'></span><span class='col-datos'></span></div>");
            temporalContador++;
            
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            
            // Avanzamos k desde i + 1 para NO duplicar mecánicamente el punto donde se realizó el corte
            for (let k = i + 1; k <= finImpresion; k++) {
                let distanciaFaltante = marcasArray[k].valor - marcaBaseInicioTramo;
                let medidaDesdeCero = valorPestañaReducida + distanciaFaltante;
                
                // Generamos la celda central en el sobrante apuntando a la izquierda
                let celdaCorte = (k === indiceCorteEnEsteTramo) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
                let textoMarca = temporalContador + ".-) " + Math.round(medidaDesdeCero);
                let textoControl = (marcasArray[k].control !== null) ? marcasArray[k].control : "";
                temporalContador++;

                lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + textoMarca + "</span>" + celdaCorte + "<span class='col-datos col-control'>" + textoControl + "</span></div>");
            }
            i = finImpresion;
        }

        bloquesPlanchas.push({ esUltima: esUltima, contenido: encabezadoColumnas + lineasMarcas.join("") });
        
        // Romper si ya alcanzamos la marca de cierre final
        if (i >= marcasArray.length - 1) break;
    }




    // --- CORREGIDO AQUÍ: Se restauraron los índices [0] y [1] correctos ---
    let htmlFinal = "";
    if (bloquesPlanchas.length === 1) {
        htmlFinal += `<div class='titulo-plancha'>--- PLANCHA 1 ---</div>` + bloquesPlanchas[0].contenido;
    } else if (bloquesPlanchas.length > 1) {
        htmlFinal += `<div class='titulo-plancha'>--- PLANCHA 1 ---</div>` + bloquesPlanchas[0].contenido;
        let totalPlanchas = bloquesPlanchas.length;
        
        if (totalPlanchas > 2) {
            let listadoNumeros = [];
            for (let p = 2; p < totalPlanchas; p++) {
                listadoNumeros.push(p);
            }
            htmlFinal += `<div class='titulo-plancha'>--- PLANCHA ${listadoNumeros.join(", ")} (SON IGUALES) ---</div>` + bloquesPlanchas[1].contenido;
        }
        htmlFinal += `<div class='titulo-plancha'>--- PLANCHA ${totalPlanchas} (SOBRANTE) ---</div>` + bloquesPlanchas[totalPlanchas - 1].contenido;
    }

    document.getElementById("listaMarcas").innerHTML = htmlFinal;

    ultimaMedidaPlancha = anchoPlancha;
    ultimaMedidaFinal = medidaFinal;
    ultimaProfundidad = profundidad;
    ultimoBorde = bordes;
    ultimoCanalCantidad = canales;
    ultimoEspesor = espesor;
}

// NUEVA FUNCIÓN: Maneja el bloqueo visual en pantalla de la profundidad
function evaluarCanales() {
    const inputCanales = document.getElementById("canales");
    const inputProfundidad = document.getElementById("profundidad");
    const valorCanales = Number(inputCanales.value);

    if (valorCanales === 1) {
        if (inputProfundidad.value !== "0" && inputProfundidad.value !== "") {
            inputProfundidad.dataset.valorReal = inputProfundidad.value;
        }
        inputProfundidad.value = 0;
        inputProfundidad.disabled = true;
        inputProfundidad.style.backgroundColor = "#e2e8f0";
        inputProfundidad.style.color = "#94a3b8";
    } else {
        inputProfundidad.disabled = false;
        inputProfundidad.style.backgroundColor = "";
        inputProfundidad.style.color = "";
        if (inputProfundidad.dataset.valorReal) {
            inputProfundidad.value = inputProfundidad.dataset.valorReal;
        }
    }
}

// --- VALIDACIONES ONBLUR ORIGINALES ---
function verificarMedidaPlancha() {
    const campo = document.getElementById("anchoPlancha");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Medida de Plancha inválida."); campo.value = ultimaMedidaPlancha; } 
    else { ultimaMedidaPlancha = valor; }
}
function verificarMedidaFinal() {
    const campo = document.getElementById("medidaFinal");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Medida Final inválida."); campo.value = ultimaMedidaFinal; } 
    else { ultimaMedidaFinal = valor; }
}
function verificarCanales() {
    const campo = document.getElementById("canales");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Cantidad de Canales inválida."); campo.value = ultimoCanalCantidad; } 
    else { ultimoCanalCantidad = valor; }
}
function verificarProfundidad() {
    const campo = document.getElementById("profundidad");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) { alert("Profundidad inválida."); campo.value = ultimaProfundidad; } 
    else { ultimaProfundidad = valor; }
}
function verificarBordes() {
    const campo = document.getElementById("bordes");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) { alert("Bordes inválidos."); campo.value = ultimoBorde; } 
    else { ultimoBorde = valor; }
}
function verificarEspesor() {
    const campo = document.getElementById("espesor");
    let valor = Number(campo.value);
    
if (campo.value === "" || valor < 0) { alert("Espesor inválido.");
    campo.value = ultimoEspesor; }
    else {
        ultimoEspesor = valor;
    }
    }
