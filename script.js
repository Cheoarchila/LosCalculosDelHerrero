// Variables globales de respaldo (valores iniciales por defecto)
let ultimaMedidaPlancha = 1200;
let ultimaMedidaFinal = 1000;
let ultimaProfundidad = 15;
let ultimoBorde = 20;
let ultimoCanalCantidad = 3;
let ultimoEspesor = 1;

// Variables globales de respaldo para la pantalla de Canales Diferentes
let ultimaMedidaPlanchaDif = 1200;
let ultimaMedidaFinalDif = 1030;
let ultimoCanalesParesDif = 1;
let ultimoAnchoCanalParDif = 30;
let ultimaProfundidadDif = 15;
let ultimoBordeDif = 20;
let ultimoEspesorDif = 1;

// Variables globales de respaldo para la pantalla de 45 Grados
let ultimaMedidaPlancha45 = 1200;
let ultimaMedidaFinal45 = 1000;
let ultimoCanalCantidad45 = 3;
let ultimaProfundidad45 = 15;
let ultimoBorde45 = 20;
let ultimoEspesor45 = 1;

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

        // Guardar estados válidos de respaldo para Canales Diferentes
    ultimaMedidaPlanchaDif = anchoPlancha;
    ultimaMedidaFinalDif = medidaFinal;
    ultimoCanalesParesDif = canalesPares;
    ultimoAnchoCanalParDif = anchoPar;
    ultimaProfundidadDif = profundidad;
    ultimoBordeDif = bordes;
    ultimoEspesorDif = espesor;
}

// --- FUNCIONES DE VERIFICACIÓN PARA CANALES DIFERENTES (ONBLUR) ---

function verificarMedidaPlanchaDif() {
    const campo = document.getElementById("anchoPlanchaDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) {
        alert("Debes ingresar una Medida de Plancha válida.");
        campo.value = ultimaMedidaPlanchaDif;
    } else {
        ultimaMedidaPlanchaDif = valor;
    }
}

function verificarMedidaFinalDif() {
    const campo = document.getElementById("medidaFinalDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) {
        alert("Debes ingresar una Medida Final válida.");
        campo.value = ultimaMedidaFinalDif;
    } else {
        ultimaMedidaFinalDif = valor;
    }
}

function verificarCanalesParesDif() {
    const campo = document.getElementById("canalesParesDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) {
        alert("Debes ingresar una cantidad de Canales Finos válida.");
        campo.value = ultimoCanalesParesDif;
    } else {
        ultimoCanalesParesDif = valor;
    }
}

function verificarAnchoCanalParDif() {
    const campo = document.getElementById("anchoCanalParDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) {
        alert("Debes ingresar un Ancho de Canal Fino válido.");
        campo.value = ultimoAnchoCanalParDif;
    } else {
        ultimoAnchoCanalParDif = valor;
    }
}

function verificarProfundidadDif() {
    const campo = document.getElementById("profundidadDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) {
        alert("Debes ingresar una Profundidad válida.");
        campo.value = ultimaProfundidadDif;
    } else {
        ultimaProfundidadDif = valor;
    }
}

function verificarBordesDif() {
    const campo = document.getElementById("bordesDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) {
        alert("Debes ingresar un valor de Bordes válido.");
        campo.value = ultimoBordeDif;
    } else {
        ultimoBordeDif = valor;
    }
}

function verificarEspesorDif() {
    const campo = document.getElementById("espesorDif");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) {
        alert("Debes ingresar un Espesor válido.");
        campo.value = ultimoEspesorDif;
    } else {
        ultimoEspesorDif = valor;
    }
}

// Control visual y bloqueos para la pantalla de 45°
function evaluarCanales45() {
    const inputCanales = document.getElementById("canales45");
    const inputProfundidad = document.getElementById("profundidad45");
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

// FUNCIÓN MATEMÁTICA Y DE TRAZADO PRINCIPAL A 45 GRADOS (MARCA INICIAL Y CIERRES AJUSTADOS)
// FUNCIÓN MATEMÁTICA Y DE TRAZADO PRINCIPAL A 45 GRADOS (CORREGIDA CON CIERRE EN BORDE PARA PLANCHA 1)
function calcular45() {
    const anchoPlancha = Number(document.getElementById("anchoPlancha45").value);
    const medidaFinal = Number(document.getElementById("medidaFinal45").value);
    const canales = Number(document.getElementById("canales45").value);
    const inputProfundidad = document.getElementById("profundidad45");
    const bordes = Number(document.getElementById("bordes45").value);
    const espesor = Number(document.getElementById("espesor45").value);

    let profundidad = Number(inputProfundidad.value);
    if (canales === 1) profundidad = 1;

    // 1. Deducción milimétrica de tramos según tus especificaciones de taller
    const canalAncho = (medidaFinal / canales) - (12 * espesor);
    const canalInclinado = Math.round(profundidad * 1.414);
    const cantidadInclinados = (canales - 1) * 2;
    const bordeLimpio = bordes - espesor;
    const valorEngrape = Math.round(canalInclinado - 5);

    // Desarrollo base limpio sin contar pestañas de engrape extras
    const desarrolloBase = (bordeLimpio * 2) + (canales * canalAncho) + (cantidadInclinados * canalInclinado);
    const requiereEngrape = (desarrolloBase > anchoPlancha);

    // Inyectamos resultados base informativos en pantalla
    document.getElementById("canalAncho45").textContent = Math.round(canalAncho);
    document.getElementById("canalInclinado45").textContent = Math.round(canalInclinado);
    document.getElementById("desarrollo45").textContent = Math.round(desarrolloBase);

    // --- FASE 1: GENERACIÓN DEL MAPA DE MARCAS REAL CONTINUO DE LA PIEZA ---
    let marcasContinuas = [];
    let marcaAcumulada = 0;

    // Si la pieza cabe en una plancha, empieza con borde limpio. Si se pasa, activa tu regla de engrape.
    if (requiereEngrape) {
        marcaAcumulada += valorEngrape;
        marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'engrape_inicial' });
        marcaAcumulada += canalInclinado;
        marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'inclinado_inicial' });
    } else {
        marcaAcumulada += bordeLimpio;
        marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'borde' });
    }

    // Alternancia interna de canales planos y diagonales
    for (let c = 1; c <= canales; c++) {
        marcaAcumulada += canalAncho;
        marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'ancho' });

        if (c < canales) {
            marcaAcumulada += canalInclinado;
            marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'inclinado' });
            marcaAcumulada += canalInclinado;
            marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'inclinado' });
        }
    }

    // Cierre del trazado real continuo
    if (!requiereEngrape) {
        marcaAcumulada += bordeLimpio;
        marcasContinuas.push({ valor: Math.round(marcaAcumulada), tipo: 'borde' });
    }

    // --- FASE 2: DISTRIBUCIÓN Y FRACCIONAMIENTO REAL EN CHAPAS ---
    let bloquesPlanchas = [];
    let numeroPlancha = 1;
    let m = 0; // Puntero del índice del array de marcas continuas
    let valorAcumuladoDeCortesPrevios = 0;

    const encabezadoColumnas2Col = "<div class='fila-marca'><span class='col-encabezado'>MARCAS</span><span class='col-espacio-corte'></span></div>";

    while (m < marcasContinuas.length) {
        let lineasMarcas = [];
        let temporalContador = 1;
        let esPrimeraPlancha = (numeroPlancha === 1);
        
        let marcasEnEsteTramo = [];
        let corteEnEsteTramo = -1;
        let esUltimaPlancha = true;

        for (let pt = m; pt < marcasContinuas.length; pt++) {
            let medidaDesdeCeroChapa = marcasContinuas[pt].valor - valorAcumuladoDeCortesPrevios;
            
            if (!esPrimeraPlancha) {
                medidaDesdeCeroChapa += valorEngrape;
            }

            if (medidaDesdeCeroChapa > anchoPlancha) {
                esUltimaPlancha = false;
                let indicePosibleCorte = pt - 1;
                
                if ((indicePosibleCorte - m) % 2 === 0 && indicePosibleCorte > m) {
                    indicePosibleCorte--;
                }
                corteEnEsteTramo = indicePosibleCorte;
                break;
            }
        }

        let finRango = (corteEnEsteTramo !== -1) ? corteEnEsteTramo : marcasContinuas.length - 1;

        // --- RENDERIZADO VISUAL DE LA PLANCHA ACTUAL ---
        
        // 1. Gancho inicial si es una chapa fraccionada posterior
        if (requiereEngrape && !esPrimeraPlancha) {
            lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + temporalContador + ".-) " + valorEngrape + "</span><span class='col-espacio-corte'></span></div>");
            temporalContador++;
        }

        // 2. Mapeo exacto de las marcas asignadas a esta plancha
        for (let k = m; k <= finRango; k++) {
            let valorImprimir = marcasContinuas[k].valor - valorAcumuladoDeCortesPrevios;
            
            if (!esPrimeraPlancha) {
                valorImprimir += valorEngrape;
            }

            let esElPuntoDeCorteCalculado = (k === finRango);
            
            // --- NUEVA LÓGICA DE TU REGLA DE BORDES ---
            if (!esUltimaPlancha && esElPuntoDeCorteCalculado) {
                if (esPrimeraPlancha) {
                    // REGLA NUEVA: Plancha 1 debe terminar con bordes-1 (19 mm) en lugar de engrape
                    valorImprimir += bordeLimpio;
                } else {
                    // Planchas del centro mantienen el doble engrape (16 mm de salida)
                    valorImprimir += valorEngrape;
                }
            }

            // Si es la última plancha total, la marca de cierre ya tiene el borde-1 sumado desde la fase 1 de forma natural
            let celdaCorte = (esElPuntoDeCorteCalculado) ? "<span class='texto-corte'>◀ ✂️ CORTE</span>" : "<span class='col-espacio-corte'></span>";

            lineasMarcas.push("<div class='fila-marca'><span class='col-datos'>" + temporalContador + ".-) " + Math.round(valorImprimir) + "</span>" + celdaCorte + "</div>");
            temporalContador++;
        }

        if (!esUltimaPlancha) {
            valorAcumuladoDeCortesPrevios = marcasContinuas[finRango].valor;
            m = finRango + 1; 
        } else {
            m = marcasContinuas.length; 
        }

        let prefijoTitulo = `--- PLANCHA ${numeroPlancha} `;
        if (requiereEngrape) {
            if (esPrimeraPlancha) prefijoTitulo += "(INICIAL) ---";
            else if (!esUltimaPlancha) prefijoTitulo += "(DEL CENTRO - DOBLE ENGRAMPE) ---";
            else prefijoTitulo += "(SOBRANTE) ---";
        } else {
            prefijoTitulo += "---";
        }

        bloquesPlanchas.push({ titulo: prefijoTitulo, contenido: encabezadoColumnas2Col + lineasMarcas.join("") });
        numeroPlancha++;
        if (numeroPlancha > 20) break;
    }

    let htmlFinal = "";
    bloquesPlanchas.forEach(bloque => {
        htmlFinal += `<div class='titulo-plancha'>${bloque.titulo}</div>` + bloque.contenido;
    });

    document.getElementById("listaMarcas45").innerHTML = htmlFinal;

    ultimaMedidaPlancha45 = anchoPlancha; ultimaMedidaFinal45 = medidaFinal; ultimoCanalCantidad45 = canales;
    ultimaProfundidad45 = profundidad; ultimoBorde45 = bordes; ultimoEspesor45 = espesor;
}

// --- VALIDACIONES ONBLUR PANTALLA 45° ---
function verificarMedidaPlancha45() {
    const campo = document.getElementById("anchoPlancha45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Medida inválida."); campo.value = ultimaMedidaPlancha45; } else { ultimaMedidaPlancha45 = valor; }
}
function verificarMedidaFinal45() {
    const campo = document.getElementById("medidaFinal45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Medida inválida."); campo.value = ultimaMedidaFinal45; } else { ultimaMedidaFinal45 = valor; }
}
function verificarCanales45() {
    const campo = document.getElementById("canales45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 1) { alert("Medida inválida."); campo.value = ultimoCanalCantidad45; } else { ultimoCanalCantidad45 = valor; }
}
function verificarProfundidad45() {
    const campo = document.getElementById("profundidad45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) { alert("Medida inválida."); campo.value = ultimaProfundidad45; } else { ultimaProfundidad45 = valor; }
}
function verificarBordes45() {
    const campo = document.getElementById("bordes45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) { alert("Medida inválida."); campo.value = ultimoBorde45; } else { ultimoBorde45 = valor; }
}
function verificarEspesor45() {
    const campo = document.getElementById("espesor45");
    let valor = Number(campo.value);
    if (campo.value === "" || valor < 0) { alert("Medida inválida."); campo.value = ultimoEspesor45; } else { ultimoEspesor45 = valor; }
}
