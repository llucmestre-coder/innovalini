/* ============================================================
   calculadora.js — Innovalini · element signatura
   Calculadora ORIENTATIVA de reforma de baño o cocina.
   Devuelve una HORQUILLA (nunca una cifra de falsa precisión).
   ⚠ Los rangos son PROVISIONALES — validar con el cliente
     (ver REUNION-CLIENTE.md) antes de publicar.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const calc = document.getElementById('calculadora');
  if (!calc) return;

  /* Precio base orientativo por m² según estancia y nivel de acabados (€/m²).
     PROVISIONAL. Ajustar con datos reales de Innovalini. */
  const BASE = {
    bano:   { esencial: 950,  diseno: 1350, premium: 1900 },
    cocina: { esencial: 850,  diseno: 1250, premium: 1750 }
  };
  /* Suelo de obra: una reforma pequeña no baja de aquí (desplazamiento,
     licencias, gremios, mínimos). PROVISIONAL. */
  const MINIMO = { bano: 4500, cocina: 6000 };

  /* Extras con coste aproximado fijo (€). PROVISIONAL. */
  const EXTRAS = {
    mampara:   { nom: 'Mampara a medida',        preu: 700 },
    mueble:    { nom: 'Mobiliario a medida',     preu: 1600 },
    radiante:  { nom: 'Suelo radiante',          preu: 1400 },
    domotica:  { nom: 'Domótica / iluminación',  preu: 900 }
  };

  const elTipo   = () => calc.querySelector('input[name="tipo"]:checked').value;
  const elNivel  = () => calc.querySelector('input[name="nivel"]:checked').value;
  const elM2     = calc.querySelector('#calc-m2');
  const elM2Val  = calc.querySelector('#calc-m2-valor');
  const elExtras = () => Array.from(calc.querySelectorAll('input[name="extra"]:checked')).map(i => i.value);

  const outMin      = calc.querySelector('#calc-min');
  const outMax      = calc.querySelector('#calc-max');
  const outDesglos  = calc.querySelector('#calc-desglos');
  const waLink      = calc.querySelector('#calc-wa');

  const WHATSAPP = '34660208664';

  const eur = (n) => Math.round(n / 100) * 100; // redondeo a centenas
  const fmt = (n) => eur(n).toLocaleString('es-ES');

  function calcular() {
    const tipo  = elTipo();
    const nivel = elNivel();
    const m2    = parseInt(elM2.value, 10);
    const extras = elExtras();

    let base = BASE[tipo][nivel] * m2;
    base = Math.max(base, MINIMO[tipo]);

    let extrasTotal = 0;
    extras.forEach(k => { extrasTotal += EXTRAS[k].preu; });

    const total = base + extrasTotal;
    /* Horquilla: ±15% alrededor del estimado */
    const min = total * 0.85;
    const max = total * 1.15;

    outMin.textContent = fmt(min);
    outMax.textContent = fmt(max);
    if (elM2Val) elM2Val.textContent = m2 + ' m²';

    /* Desglose legible */
    const nivelNom = { esencial: 'Esencial', diseno: 'Diseño', premium: 'Premium' }[nivel];
    const tipoNom  = tipo === 'bano' ? 'Baño' : 'Cocina';
    let filas = `<li><span>${tipoNom} · acabado ${nivelNom} · ${m2} m²</span><span>${fmt(base)} €</span></li>`;
    extras.forEach(k => {
      filas += `<li><span>${EXTRAS[k].nom}</span><span>+${EXTRAS[k].preu.toLocaleString('es-ES')} €</span></li>`;
    });
    outDesglos.innerHTML = filas;

    /* Enlace de WhatsApp con el resumen precargado */
    const extrasTxt = extras.length ? extras.map(k => EXTRAS[k].nom).join(', ') : 'sin extras';
    const msg = `Hola Innovalini, he usado la calculadora de la web:\n`
      + `· ${tipoNom} de ${m2} m²\n`
      + `· Acabado ${nivelNom}\n`
      + `· Extras: ${extrasTxt}\n`
      + `· Estimación orientativa: ${fmt(min)}–${fmt(max)} €\n`
      + `Me gustaría concretar presupuesto.`;
    waLink.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  /* Eventos */
  calc.querySelectorAll('input[name="tipo"], input[name="nivel"], input[name="extra"]')
      .forEach(i => i.addEventListener('change', calcular));
  elM2.addEventListener('input', calcular);

  calcular(); // estado inicial
});
