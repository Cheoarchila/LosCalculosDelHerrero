// js/script.js - LÓGICA CORRECTA PARA MÚLTIPLES PLANCHAS
// La secuencia de marcas se divide en planchas en los últimos verticales que caben

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const fmt = (v, digits = 0) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(v) + " mm";

  const toFloat = (el, fallback = NaN) => {
    const v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  };
  const toInt = (el, fallback = NaN) => {
    const v = parseInt(el.value, 10);
    return isNaN(v) ? fallback : v;
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  function debounce(fn, wait = 150) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const refs = {
    pantallaInicio: $("pantallaInicio"),
    pantallaAcanalado: $("pantallaAcanalado"),
    pantalla90: $("pantalla90"),
    anchoPlancha: $("anchoPlancha"),
    medidaFinal: $("medidaFinal"),
    divisiones: $("divisiones"),
    profundidad: $("profundidad"),
    bordes: $("bordes"),
    espesor: $("espesor"),
    desarrollo: $("desarrollo"),
    anchoCanal: $("anchoCanal"),
    marcas: $("marcas"),
    filaProfundidad: $("filaProfundidad"),
    mensajeProfundidad: $("mensajeProfundidad")
  };

  // NAVEGACIÓN
  function ocultarPantallas() {
    refs.pantallaInicio && (refs.pantallaInicio.style.display = "none");
    refs.pantallaAcanalado && (refs.pantallaAcanalado.style.display = "none");
    refs.pantalla90 && (refs.pantalla90.style.display = "none");
  }
  
  function abrirAcanalado() {
    ocultarPantallas();
    refs.pantallaAcanalado.style.display = "block";
  }
  
  function volverInicio() {
    ocultarPantallas();
    refs.pantallaInicio.style.display = "block";
  }
  
  function abrir90() {
    ocultarPantallas();
    refs.pantalla90.style.display = "block";
    calcular90();
  }
  
  function volverAcanalado() {
    ocultarPantallas();
    refs.pantallaAcanalado.style.display = "block";
  }

  function editarPlancha() {
    const campo = refs.anchoPlancha;
    if (campo.readOnly) {
      campo.readOnly = false;
      campo.focus();
      campo.select();
    } else {
      campo.readOnly = true;
      calcular90();
    }
  }

  // CALCULAR VALORES PRINCIPALES
  function calcularValores({ anchoPlancha, medida, canales, profundidad, bordes, espesor }) {
    canales = clamp(Math.floor(canales), 1, 9999);
    if (canales <= 1) profundidad = 0;
    if (isNaN(profundidad)) profundidad = canales === 1 ? 0 : 15;

    const anchoCanal = medida / canales;

    // Fórmula: ((Bordes*2)+(Medida Interna)+((Canales-1)*Profundidad))-(2*Espesor)
    // Se resta solo 2*Espesor porque al doblar, el material crece 1mm a cada lado
    const desarrollo =
      (bordes * 2 + medida + (canales - 1) * profundidad) - 2 * espesor;

    return { desarrollo, anchoCanal, canales, profundidad };
  }

  function mostrarResultados(desarrollo, anchoCanal) {
    refs.desarrollo.textContent = fmt(Math.round(desarrollo));
    refs.anchoCanal.textContent = fmt(Math.round(anchoCanal));
  }

  // GENERAR ARRAY DE MARCAS (secuencia completa)
  function calcularMarcas({ anchoCanal, profundidad, bordes, espesor, canales }) {
    // Horizontal: ancho del canal menos espesor×2 (compensación por dobleces)
    const horizontal = anchoCanal - espesor * 2;
    // Vertical: profundidad menos espesor×2 (compensación por dobleces)
    const vertical = profundidad - espesor * 2;

    const marcas = [];
    let numero = 1;
    let marca = bordes - espesor;

    // Marca inicial: Borde - Espesor (al doblar medirá "bordes")
    marcas.push({ numero, valor: Math.round(marca), tipo: "borde", esVertical: false });

    // Secuencia de canales: horizontal, vertical, horizontal, vertical...
    for (let i = 1; i <= canales; i++) {
      // Horizontal (ancho del canal)
      numero++;
      marca += horizontal;
      marcas.push({ numero, valor: Math.round(marca), tipo: "horizontal", esVertical: false });

      // Vertical (profundidad) - solo si no es el último canal
      if (i < canales) {
        numero++;
        marca += vertical;
        marcas.push({ numero, valor: Math.round(marca), tipo: "profundidad", esVertical: true });
      }
    }

    // Marca final: Borde - Espesor (al doblar medirá "bordes")
    numero++;
    marca += bordes - espesor;
    marcas.push({ numero, valor: Math.round(marca), tipo: "bordeFinal", esVertical: false });

    return { marcas, horizontal, vertical };
  }

  // RENDERIZAR MÚLTIPLES PLANCHAS CON LÓGICA CORRECTA
  function renderMarcas({ marcas, anchoPlancha, bordes, profundidad }) {
    const frag = document.createDocumentFragment();
    let numeroPlancha = 1;
    let indiceInicio = 0;

    while (indiceInicio < marcas.length) {
      const piece = document.createElement("div");
      piece.className = "plancha";

      const h3 = document.createElement("h3");
      h3.textContent = `PLANCHA ${numeroPlancha}`;
      piece.appendChild(h3);

      // Posición inicial según el tipo de plancha
      const esPrimera = numeroPlancha === 1;
      let posicionActual = esPrimera ? bordes - 1 : profundidad - 1;

      const indicesToShow = [];
      const positionsToShow = [];

      // Agregar la marca inicial
      indicesToShow.push(indiceInicio);
      positionsToShow.push(posicionActual);

      let ultimoIndiceVertical = indiceInicio;
      let referenciaValor = marcas[indiceInicio].valor;

      // Buscar marcas que caben en esta plancha
      for (let i = indiceInicio + 1; i < marcas.length; i++) {
        const distancia = marcas[i].valor - referenciaValor;
        const nuevaPosicion = posicionActual + distancia;

        // Si cabe en la plancha
        if (nuevaPosicion <= anchoPlancha) {
          posicionActual = nuevaPosicion;
          indicesToShow.push(i);
          positionsToShow.push(posicionActual);

          // Guardar el índice si es una marca vertical (punto de corte potencial)
          if (marcas[i].esVertical) {
            ultimoIndiceVertical = i;
          }

          referenciaValor = marcas[i].valor;
        } else {
          // No cabe, terminar aquí
          break;
        }
      }

      // Asegurar que la última marca mostrada sea vertical (punto de corte correcto)
      // A menos que sea la última marca del desarrollo
      let indiceCorte = ultimoIndiceVertical;
      
      // Si la última marca mostrada es la final (bordeFinal), no recortar
      if (marcas[indicesToShow[indicesToShow.length - 1]].tipo === "bordeFinal") {
        indiceCorte = indicesToShow.length - 1;
      }

      // Filtrar para mostrar solo hasta el corte
      const marcasFinales = indicesToShow.slice(0, indiceCorte + 1);
      const posicionesFinales = positionsToShow.slice(0, indiceCorte + 1);

      // Renderizar filas
      marcasFinales.forEach((indice, j) => {
        const row = document.createElement("div");
        row.className = "marca-row";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.whiteSpace = "nowrap";
        row.style.fontFamily = "Consolas, monospace";
        row.style.padding = "6px 0";

        // Número de marca
        const spanNum = document.createElement("span");
        spanNum.style.display = "inline-block";
        spanNum.style.width = "55px";
        spanNum.style.textAlign = "right";
        spanNum.style.fontWeight = "bold";
        spanNum.textContent = `${marcas[indice].numero}-)`;

        // Posición
        const spanPos = document.createElement("span");
        spanPos.style.display = "inline-block";
        spanPos.style.width = "80px";
        spanPos.style.textAlign = "right";
        spanPos.style.marginLeft = "8px";
        spanPos.style.fontWeight = "bold";
        spanPos.textContent = Math.round(posicionesFinales[j]);

        // Tipo de marca
        const spanTipo = document.createElement("span");
        spanTipo.style.marginLeft = "15px";
        spanTipo.style.fontSize = "12px";
        spanTipo.style.color = "#666";
        
        const tipoMarca = marcas[indice].tipo;
        if (tipoMarca === "borde") spanTipo.textContent = "[Borde Inicial]";
        else if (tipoMarca === "bordeFinal") spanTipo.textContent = "[Borde Final]";
        else if (tipoMarca === "profundidad") spanTipo.textContent = "[Profundidad]";
        else if (tipoMarca === "horizontal") spanTipo.textContent = "[Canal]";

        row.appendChild(spanNum);
        row.appendChild(spanPos);
        row.appendChild(spanTipo);

        // Indicar CORTE si es la última marca de esta plancha
        if (j === marcasFinales.length - 1 && indiceCorte < marcas.length - 1) {
          const cutLabel = document.createElement("span");
          cutLabel.style.marginLeft = "10px";
          cutLabel.style.color = "red";
          cutLabel.style.fontWeight = "bold";
          cutLabel.textContent = "◄ CORTE";
          row.appendChild(cutLabel);
        }

        piece.appendChild(row);
      });

      frag.appendChild(piece);

      // Verificar si hemos llegado al final
      if (marcasFinales[marcasFinales.length - 1] === marcas.length - 1) {
        // Última plancha, fin
        break;
      }

      // La próxima plancha comienza después del último corte
      indiceInicio = ultimoIndiceVertical + 1;
      numeroPlancha++;
    }

    refs.marcas.innerHTML = "";
    refs.marcas.appendChild(frag);
  }

  // FUNCIÓN PRINCIPAL
  function calcular90() {
    const anchoPlancha = toFloat(refs.anchoPlancha, NaN);
    const medida = toFloat(refs.medidaFinal, NaN);
    let canales = toInt(refs.divisiones, NaN);
    let profundidad = toFloat(refs.profundidad, NaN);
    const bordes = toFloat(refs.bordes, NaN);
    const espesor = toFloat(refs.espesor, NaN);

    if ([anchoPlancha, medida, canales, bordes, espesor].some(v => isNaN(v))) {
      return;
    }

    canales = Math.max(1, Math.floor(canales));

    const { desarrollo, anchoCanal } = calcularValores({
      anchoPlancha,
      medida,
      canales,
      profundidad,
      bordes,
      espesor
    });

    mostrarResultados(desarrollo, anchoCanal);

    const { marcas } = calcularMarcas({
      anchoCanal,
      profundidad,
      bordes,
      espesor,
      canales
    });

    renderMarcas({
      marcas,
      anchoPlancha,
      bordes,
      profundidad
    });
  }

  function actualizarProfundidadUI() {
    const canales = toInt(refs.divisiones, 1);
    if (canales === 1) {
      refs.filaProfundidad.style.display = "none";
      refs.mensajeProfundidad.style.display = "flex";
      refs.profundidad.disabled = true;
    } else {
      refs.filaProfundidad.style.display = "flex";
      refs.mensajeProfundidad.style.display = "none";
      refs.profundidad.disabled = false;
    }
  }

  // INICIALIZAR
  document.addEventListener("DOMContentLoaded", function () {
    const controles = [
      "anchoPlancha",
      "medidaFinal",
      "divisiones",
      "profundidad",
      "bordes",
      "espesor"
    ];

    const debounced = debounce(calcular90, 120);

    controles.forEach(id => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("input", debounced);
      el.addEventListener("change", debounced);
    });

    const divisionesEl = refs.divisiones;
    if (divisionesEl) {
      divisionesEl.addEventListener("change", () => {
        actualizarProfundidadUI();
        calcular90();
      });
    }

    // Exponer funciones globales
    window.abrirAcanalado = abrirAcanalado;
    window.volverInicio = volverInicio;
    window.abrir90 = abrir90;
    window.volverAcanalado = volverAcanalado;
    window.editarPlancha = editarPlancha;
    window.calcular90 = calcular90;

    actualizarProfundidadUI();
    calcular90();
  });
})();
