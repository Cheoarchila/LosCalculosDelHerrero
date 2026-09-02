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
                // CONDICIÓN UNIFICADA: Si es punto de fraccionamiento O final definitivo del desarrollo, activa el letrero
                let esUltimaMarcaTotal = (k === marcasArray.length - 1);
                let celdaCorte = (k === indiceCorteEnEsteTramo || esUltimaMarcaTotal) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
                let textoMarca = marcasArray[k].num + ".-) " + marcasArray[k].valor;
                let textoControl = (marcasArray[k].control !== null) ? marcasArray[k].control : "";

                // Inyectamos la celda de corte justo en medio de marcas y controles para mantener el diseño limpio
                lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + textoMarca + "</span>" + celdaCorte + "<span class='col-datos col-control'>" + textoControl + "</span></div>");
            }
            i = finImpresion; 
        } else {
            lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + temporalContador + ".-) " + Math.round(valorPestañaReducida) + "</span><span class='col-espacio-corte'></span><span class='col-datos'></span></div>");
            temporalContador++;
            
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            
            // Avanzamos k desde i + 1 para corregir el salto y arrastre exacto en esta función
            for (let k = i + 1; k <= finImpresion; k++) {
                let distanciaFaltante = marcasArray[k].valor - marcaBaseInicioTramo;
                let medidaDesdeCero = valorPestañaReducida + distanciaFaltante;
                
                // CONDICIÓN UNIFICADA PARA PLANCHAS SIGUIENTES
                let esUltimaMarcaTotal = (k === marcasArray.length - 1);
                let celdaCorte = (k === indiceCorteEnEsteTramo || esUltimaMarcaTotal) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
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

// ========================================================
// LÓGICA PARA PANTALLA: CANALES DIFERENTES (PATRÓN ALTERNADO)
// ========================================================

// Controla el comportamiento visual si el usuario modifica los canales finos
function evaluarCanalesDif() {
    const inputCanalesPares = document.getElementById("canalesParesDif");
    const inputAnchoPar = document.getElementById("anchoCanalParDif");
    const valorPares = Number(inputCanalesPares.value);

    // Si el usuario pone 0 o menos canales finos, inhabilitamos el ancho del canal fino
    if (valorPares < 1) {
        inputAnchoPar.value = 0;
        inputAnchoPar.disabled = true;
        inputAnchoPar.style.backgroundColor = "#e2e8f0";
        inputAnchoPar.style.color = "#94a3b8";
    } else {
        inputAnchoPar.disabled = false;
        inputAnchoPar.style.backgroundColor = "";
        inputAnchoPar.style.color = "";
        if (inputAnchoPar.value === "0") {
            inputAnchoPar.value = 30; // Restaura valor por defecto si estaba en cero
        }
    }
}

// FUNCIÓN PRINCIPAL DE CÁLCULO PARA CANALES DIFERENTES (SIN COLUMNA DE CONTROL)
function calcularDiferentes() {
    // 1. Captura de datos desde la pantalla
    const anchoPlancha = Number(document.getElementById("anchoPlanchaDif").value);
    const medidaFinal = Number(document.getElementById("medidaFinalDif").value);
    const canalesPares = Number(document.getElementById("canalesParesDif").value);
    const anchoPar = Number(document.getElementById("anchoCanalParDif").value);
    const profundidad = Number(document.getElementById("profundidadDif").value);
    const bordes = Number(document.getElementById("bordesDif").value);
    const espesor = Number(document.getElementById("espesorDif").value);

    // 2. Deducción de la estructura física según tus reglas de taller
    const canalesImpares = canalesPares + 1;
    const canalesTotales = canalesPares + canalesImpares;

    // 3. Distribución matemática de los anchos de canal
    const espacioOcupadoPares = canalesPares * anchoPar;
    const espacioRestanteImpares = medidaFinal - espacioOcupadoPares;
    const anchoImpar = espacioRestanteImpares / canalesImpares;

    // Inyectamos en la pantalla el ancho resultante para los canales impares (grandes)
    document.getElementById("anchoCanalImparDif").textContent = Math.round(anchoImpar);

    // 4. Fórmula de desarrollo para canales variables con dobleces a 90°
    const desarrollo = (bordes * 2) + medidaFinal + ((canalesTotales - 1) * profundidad) - (canalesTotales * 4 * espesor) + ((canalesTotales - 1) * espesor);
    document.getElementById("desarrolloDif").textContent = Math.round(desarrollo);

    // --- CICLO DE GENERACIÓN DE MARCAS CON ANCHOS VARIABLES ---
    let marca = bordes - espesor;
    let contador = 1;
    let marcasArray = [];
    
    // Paso 1: Primer trazo base
    marcasArray.push({ num: contador++, valor: Math.round(marca) });

    const altoReducido = profundidad - (2 * espesor);
    
    // Recorremos secuencialmente los canales totales de la pieza terminada
    for (let c = 1; c <= canalesTotales; c++) {
        let esImpar = (c % 2 !== 0);
        let anchoCanalActual = esImpar ? anchoImpar : anchoPar;

        if (esImpar) {
            marca += (anchoCanalActual - (2 * espesor));
        } else {
            marca += anchoCanalActual;
        }
        
        // Pasos pares del trazado
        marcasArray.push({ num: contador++, valor: Math.round(marca) });

        if (c < canalesTotales) {
            marca += altoReducido;
            // Pasos impares del trazado
            marcasArray.push({ num: contador++, valor: Math.round(marca) });
        }
    }

    // Cierre del desarrollo
    marca += (bordes - espesor);
    marcasArray.push({ num: contador, valor: Math.round(marca) });

    // --- PROCESAMIENTO CÍCLICO DE PLANCHAS Y FRACCIONAMIENTO ---
    let bloquesPlanchas = [];
    let i = 0;
    let valorPestañaReducida = profundidad - (2 * espesor);

    // Encabezado con 2 columnas exclusivas para Canales Diferentes: Marcas y Aviso de Corte
    const encabezadoColumnas2Col = "<div class='fila-marca'><span class='col-encabezado'>MARCAS</span><span class='col-espacio-corte'></span></div>";

    while (i < marcasArray.length) {
        let esUltima = true;
        let marcaBaseInicioTramo = marcasArray[i].valor;
        let temporalContador = 1;
        let lineasMarcas = [];
        let indiceCorteEnEsteTramo = -1;

        // Buscamos punto de corte proyectado según la longitud física de la plancha actual
        for (let j = i + 1; j < marcasArray.length; j++) {
            let medidaProyectadaDesdeCero = (bloquesPlanchas.length === 0) ? 
                marcasArray[j].valor : 
                (valorPestañaReducida + (marcasArray[j].valor - marcaBaseInicioTramo));
            
            if (medidaProyectadaDesdeCero > anchoPlancha) {
                let posibleIndiceCorte = j - 1;
                // Forzar corte estructural óptimo en paso impar
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
                // Si es el punto de quiebre por tamaño O es el final definitivo del desarrollo total
                let esUltimaMarcaTotal = (k === marcasArray.length - 1);
                let celdaCorte = (k === indiceCorteEnEsteTramo || esUltimaMarcaTotal) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
                let textoMarca = marcasArray[k].num + ".-) " + marcasArray[k].valor;

                lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + textoMarca + "</span>" + celdaCorte + "</div>");
            }
            i = finImpresion; 
        } else {
            // Siguientes planchas: la primera marca física es el acople de la pestaña reducida
            lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + temporalContador + ".-) " + Math.round(valorPestañaReducida) + "</span><span class='col-espacio-corte'></span></div>");
            temporalContador++;
            
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            for (let k = i + 1; k <= finImpresion; k++) {
                let distanciaFaltante = marcasArray[k].valor - marcaBaseInicioTramo;
                let medidaDesdeCero = valorPestañaReducida + distanciaFaltante;
                
                // VALIDACIÓN GARANTIZADA PARA TODAS LAS PLANCHAS: Si llegamos al final del recorrido (k) o al punto de fraccionamiento de este tramo
                let esUltimaMarcaTotal = (k === marcasArray.length - 1);
                let celdaCorte = (k === indiceCorteEnEsteTramo || esUltimaMarcaTotal) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";
                
                let textoMarca = temporalContador + ".-) " + Math.round(medidaDesdeCero);
                temporalContador++;

                lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + textoMarca + "</span>" + celdaCorte + "</div>");
            }
            i = finImpresion;
        }


        bloquesPlanchas.push({ esUltima: esUltima, contenido: encabezadoColumnas2Col + lineasMarcas.join("") });
        if (i >= marcasArray.length - 1) break;
    }

    // --- RENDERIZADO EN PANTALLA DE LOS BLOQUES DE CHAPAS ---
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

    document.getElementById("listaMarcasDif").innerHTML = htmlFinal;
}
