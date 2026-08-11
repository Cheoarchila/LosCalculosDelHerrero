// js/script.js - refactorado
// Mejoras:
// - Cacheo de elementos DOM
// - Separación de cálculo y render
// - Uso de createElement en lugar de innerHTML para la lista de marcas
// - Debounce en eventos de entrada
// - Validación y valores por defecto
// - Comentarios JSDoc y formateo de unidades

(() => {
  "use strict";

  // Helpers
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

  // Debounce utility
  function debounce(fn, wait = 150) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Cached DOM refs
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

  // NAV
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

  // Edit plancha
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

  // CALCULAR (lógica pura: devuelve desarrollo y anchoCanal)
  function calcularValores({ anchoPlancha, medida, canales, profundidad, bordes, espesor }) {
    // Guardar invariantes / saneamientos
    canales = clamp(Math.floor(canales), 1, 9999);
    if (canales <= 1) profundidad = 0;
    if (isNaN(profundidad)) profundidad = canales === 1 ? 0 : 15;

    const anchoCanal = medida / canales;

    // fórmula original (manteniendo comportamiento)
    const desarrollo =
      (bordes * 2 + medida + (canales - 1) * profundidad) - canales * 4 * espesor;

    return { desarrollo, anchoCanal, canales, profundidad };
  }

  // Mostrar resultados en UI
  function mostrarResultados(desarrollo, anchoCanal) {
    refs.desarrollo.textContent = fmt(Math.round(desarrollo));
    refs.anchoCanal.textContent = fmt(Math.round(anchoCanal));
  }

  // Generar marcas (sólo arrays, sin DOM)
  function calcularMarcas({ anchoCanal, profundidad, bordes, espesor, canales }) {
    const horizontal = anchoCanal - espesor * 2;
    const vertical = profundidad - espesor * 2;

    const marcas = [];
    let numero = 1;
    let marca = bordes - espesor;

    // Borde inicial
    marcas.push({ numero, valor: Math.round(marca), tipo: "borde" });

    // Canales y profundidades
    for (let i = 1; i <= canales; i++) {
      numero++;
      marca += horizontal;
      marcas.push({ numero, valor: Math.round(marca), tipo: "horizontal" });

      if (i < canales) {
        numero++;
        marca += vertical;
        marcas.push({ numero, valor: Math.round(marca), tipo: "profundidad" });
      }
    }

    // Borde final
    numero++;
    marca += bordes - espesor;
    marcas.push({ numero, valor: Math.round(marca), tipo: "bordeFinal" });

    return { marcas, horizontal, vertical };
  }

  // Render marcas a DOM (usa DocumentFragment)
  function renderMarcas({ marcas, corte, anchoPlancha, bordes, profundidad }) {
    // Construir fragmento
    const frag = document.createDocumentFragment();

    let inicio = 0;
    let numeroPlancha = 1;

    while (inicio < marcas.length) {
      const piece = document.createElement("div");
      piece.className = "plancha";

      const h3 = document.createElement("h3");
      h3.textContent = `PLANCHA ${numeroPlancha}`;
      piece.appendChild(h3);

      const esPrimera = numeroPlancha === 1;
      let posicion = esPrimera ? bordes - 1 : profundidad - 1;

      let indices = [inicio];
      let posiciones = [posicion];

      let ultimoIndice = inicio;
      let referenciaAnterior = marcas[inicio].valor;

      for (let i = inicio + 1; i < marcas.length; i++) {
        const distancia = marcas[i].valor - referenciaAnterior;
        const nuevaPosicion = posicion + distancia;

        // Ultima marca de la pieza
        if (i === marcas.length - 1) {
          indices.push(i);
          posiciones.push(bordes - 1);
          ultimoIndice = i;
          break;
        }

        if (nuevaPosicion <= anchoPlancha) {
          posicion = nuevaPosicion;
          indices.push(i);
          posiciones.push(posicion);
          ultimoIndice = i;
          referenciaAnterior = marcas[i].valor;
        } else {
          break;
        }
      }

      // Crear filas para indices
      indices.forEach((indice, j) => {
        const row = document.createElement("div");
        row.className = "marca-row";
        // preferir CSS para estilos en lugar de inline styles
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.whiteSpace = "nowrap";
        row.style.fontFamily = "Consolas,monospace";

        const spanNum = document.createElement("span");
        spanNum.style.display = "inline-block";
        spanNum.style.width = "55px";
        spanNum.style.textAlign = "right";
        spanNum.textContent = `${marcas[indice].numero}-)`;

        const spanPos = document.createElement("span");
        spanPos.style.display = "inline-block";
        spanPos.style.width = "80px";
        spanPos.style.textAlign = "right";
        spanPos.style.marginLeft = "8px";
        spanPos.textContent = Math.round(posiciones[j]);

        row.appendChild(spanNum);
        row.appendChild(spanPos);

        if (j === indices.length - 1) {
          const cut = document.createElement("span");
          cut.style.marginLeft = "10px";
          cut.style.color = "red";
          cut.style.fontWeight = "bold";
          cut.textContent = "◄ CORTE";
          row.appendChild(cut);
        }

        piece.appendChild(row);
      });

      frag.appendChild(piece);

      if (ultimoIndice === marcas.length - 1) break;

      inicio = ultimoIndice + 1;
      numeroPlancha++;
    }

    // Reemplazar contenido actual
    refs.marcas.innerHTML = "";
    refs.marcas.appendChild(frag);
  }

  // Orquestación: generar marcas y determinar corte
  function generarMarcasUI({ anchoCanal, profundidad, bordes, espesor, canales, anchoPlancha, desarrollo }) {
    const { marcas, horizontal, vertical } = calcularMarcas({ anchoCanal, profundidad, bordes, espesor, canales });

    let corte = -1;
    if (desarrollo > anchoPlancha) {
      // buscar último vertical que cabe
      for (let i = 0; i < marcas.length; i++) {
        if (marcas[i].tipo === "profundidad" && marcas[i].valor <= anchoPlancha) {
          corte = i;
        }
      }
    } else {
      corte = marcas.length - 1;
    }

    renderMarcas({ marcas, corte, anchoPlancha, bordes, profundidad });
  }

  // Función principal que lee inputs, calcula y actualiza UI
  function calcular90() {
    const anchoPlancha = toFloat(refs.anchoPlancha, NaN);
    const medida = toFloat(refs.medidaFinal, NaN);
    let canales = toInt(refs.divisiones, NaN);
    let profundidad = toFloat(refs.profundidad, NaN);
    const bordes = toFloat(refs.bordes, NaN);
    const espesor = toFloat(refs.espesor, NaN);

    // Validación básica (si falta algo esencial, no continuar)
    if ([anchoPlancha, medida, canales, bordes, espesor].some(v => isNaN(v))) {
      // no hacemos nada si valores esenciales faltan
      return;
    }

    // Evitar < 1 y valores extremos
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

    generarMarcasUI({
      anchoCanal,
      profundidad,
      bordes,
      espesor,
      canales,
      anchoPlancha,
      desarrollo
    });
  }

  // UI state for profundidad row
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

  // Init
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
      // usar input para respuesta inmediata; change también funciona
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

    // Exponer funciones para botones (si los botones llaman desde HTML inline)
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
