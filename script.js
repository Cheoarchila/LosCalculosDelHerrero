// Variables globales de respaldo (valores iniciales por defecto)
let ultimaMedidaPlancha = 1200;
let ultimaMedidaFinal = 1000;
let ultimaProfundidad = 15;
let ultimoBorde = 20;

// Control de navegación entre pantallas
function abrirPantalla(idPantalla) {
    document.querySelectorAll('section').forEach(seccion => {
        seccion.classList.add('oculto');
    });
    document.getElementById(idPantalla).classList.remove('oculto');
}

// Lógica de cálculo matemático exacta provista por ti
function calcular() {
    // Obtención de valores numéricos de los inputs
    const anchoPlancha = Number(document.getElementById("anchoPlancha").value);
    const medidaFinal = Number(document.getElementById("medidaFinal").value);
    const canales = Number(document.getElementById("canales").value);
    const profundidad = Number(document.getElementById("profundidad").value);
    const bordes = Number(document.getElementById("bordes").value);
    const espesor = Number(document.getElementById("espesor").value);

    // Validaciones rápidas de seguridad antes de procesar loops
    if (anchoPlancha <= 0 || canales <= 0) {
        alert("Por favor introduce valores mayores a 0.");
        return;
    }

    // Cálculos estructurales
    const anchoCanal = medidaFinal / canales;
    const altoCanal = profundidad;

    // Fórmula de desarrollo original provista
    const desarrollo = (bordes * 2) + medidaFinal + ((canales - 1) * profundidad) - (canales * 4 * espesor) + ((canales - 1) * espesor);
    
    // Inyección de resultados en pantalla
    document.getElementById("anchoCanal").textContent = Math.round(anchoCanal);
    document.getElementById("altoCanal").textContent = Math.round(altoCanal);
    document.getElementById("desarrollo").textContent = Math.round(desarrollo);

    // --- Ciclo de Generación de Marcas ---
    let marca = bordes - espesor;
    let contador = 1;

    const altoReducido = profundidad - (2 * espesor); // Mantiene las paredes en mm reales
    let marcasArray = [];
    
    // Paso 1: No lleva punto de control (null)
    marcasArray.push({ num: contador++, valor: Math.round(marca), control: null });

    let controlAcumulado = 0;
    
    // El ciclo recorre dinámicamente cada canal uno por uno
    for (let c = 1; c <= canales; c++) {
        if (c % 2 !== 0) {
            marca += (anchoCanal - (2 * espesor));
        } else {
            marca += anchoCanal;
        }
        
        // Pasos pares: No llevan control
        marcasArray.push({ num: contador++, valor: Math.round(marca), control: null });

        if (c < canales) {
            marca += altoReducido;
            // Pasos impares: Acumulamos el ancho del canal limpio
            controlAcumulado += anchoCanal;
            marcasArray.push({ num: contador++, valor: Math.round(marca), control: Math.round(controlAcumulado) });
        }
    }

    // Cierre del desarrollo: No lleva control
    marca += (bordes - espesor);
    marcasArray.push({ num: contador, valor: Math.round(marca), control: null });

    // --- PROCESAMIENTO CÍCLICO DE PLANCHAS ---
    let bloquesPlanchas = [];
    let i = 0;
    let valorPestañaReducida = profundidad - (2 * espesor);

    // Encabezado con anchos fijos alineados para formato monospace
    const encabezadoColumnas = "<span style='width:130px; display:inline-block; color:#64748b;'>MARCAS</span><span style='width:130px; display:inline-block; color:#64748b;'>CONTROL</span><br>";

    while (i < marcasArray.length) {
        let esUltima = true;
        let marcaBaseInicioTramo = marcasArray[i].valor;
        let temporalContador = 1;
        let lineasMarcas = [];
        let indiceCorteEnEsteTramo = -1;

        // Buscamos punto de corte proyectado
        for (let j = i + 1; j < marcasArray.length; j++) {
            let medidaProyectadaDesdeCero = (bloquesPlanchas.length === 0) ? 
                marcasArray[j].valor : 
                (valorPestañaReducida + (marcasArray[j].valor - marcaBaseInicioTramo));
            
            if (medidaProyectadaDesdeCero > anchoPlancha) {
                let posibleIndiceCorte = j - 1;
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

        // Guardamos las marcas correspondientes a esta chapa
        if (bloquesPlanchas.length === 0) {
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            for (let k = i; k <= finImpresion; k++) {
                let sufijoCorte = (k === indiceCorteEnEsteTramo) ? " <span style='color:#ef4444; font-weight:bold;'>CORTE ➔</span>" : "";
                
                // Formateamos Columna Izquierda (Marcas) con su numeración original e inline span
                let textoMarca = marcasArray[k].num + ".-) <span>" + marcasArray[k].valor + "</span>";
                
                // Formateamos Columna Derecha (Control) limpia con el número directo
                let textoControl = "";
                if (marcasArray[k].control !== null) {
                    textoControl = "<span>" + marcasArray[k].control + "</span>";
                }

                lineasMarcas.push("<span style='width:130px; display:inline-block;'>" + textoMarca + "</span><span style='width:130px; display:inline-block; font-weight:bold; color:#0f766e;'>" + textoControl + "</span>" + sufijoCorte);
            }
            i = (finImpresion > i) ? finImpresion : i + 1; 
        } else {
            // Planchas siguientes: La primera marca es la pestaña reducida
            let textoMarcaBase = temporalContador + ".-) <span>" + Math.round(valorPestañaReducida) + "</span>";
            lineasMarcas.push("<span style='width:130px; display:inline-block;'>" + textoMarcaBase + "</span><span style='width:130px; display:inline-block;'></span>");
            temporalContador++;
            
            let finImpresion = (indiceCorteEnEsteTramo !== -1) ? indiceCorteEnEsteTramo : marcasArray.length - 1;
            for (let k = i + 1; k <= finImpresion; k++) {
                let distanciaFaltante = marcasArray[k].valor - marcaBaseInicioTramo;
                let medidaDesdeCero = valorPestañaReducida + distanciaFaltante;
                let sufijoCorte = (k === indiceCorteEnEsteTramo) ? " <span style='color:#ef4444; font-weight:bold;'>CORTE ➔</span>" : "";
                
                let textoMarca = temporalContador + ".-) <span>" + Math.round(medidaDesdeCero) + "</span>";
                
                let textoControl = "";
                if (marcasArray[k].control !== null) {
                    textoControl = "<span>" + marcasArray[k].control + "</span>";
                }
                temporalContador++;

                lineasMarcas.push("<span style='width:130px; display:inline-block;'>" + textoMarca + "</span><span style='width:130px; display:inline-block; font-weight:bold; color:#0f766e;'>" + textoControl + "</span>" + sufijoCorte);
            }
            i = (finImpresion > i) ? finImpresion : i + 1;
        }

        bloquesPlanchas.push({ esUltima: esUltima, contenido: encabezadoColumnas + lineasMarcas.join("<br>") + "<br>" });
        
        if (i >= marcasArray.length - 1) break;
    }

    // --- RENDERIZADO VISUAL EN PANTALLA ---
    let htmlFinal = "";

    if (bloquesPlanchas.length === 1) {
        htmlFinal += `<b>--- PLANCHA 1 ---</b><br>` + bloquesPlanchas[0].contenido;
    } else if (bloquesPlanchas.length > 1) {
        htmlFinal += `<b>--- PLANCHA 1 ---</b><br>` + bloquesPlanchas[0].contenido;

        let totalPlanchas = bloquesPlanchas.length;
        
        if (totalPlanchas > 2) {
            let listadoNumeros = [];
            for (let p = 2; p < totalPlanchas; p++) {
                listadoNumeros.push(p);
            }
            htmlFinal += `<br><b>--- PLANCHA ${listadoNumeros.join(", ")} (SON IGUALES) ---</b><br>` + bloquesPlanchas[1].contenido;
        }

        htmlFinal += `<br><b>--- PLANCHA ${totalPlanchas} (SOBRANTE) ---</b><br>` + bloquesPlanchas[totalPlanchas - 1].contenido;
    }

    document.getElementById("listaMarcas").innerHTML = htmlFinal;

    // Guardar estados válidos de respaldo
    ultimaMedidaPlancha = anchoPlancha;
    ultimaMedidaFinal = medidaFinal;
    ultimaProfundidad = profundidad;
    ultimoBorde = bordes;
}
