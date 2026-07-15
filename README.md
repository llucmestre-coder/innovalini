# Innovalini — web pilot

Web estàtica (HTML + CSS + JS, sense build) per a **Innovalini**, reformes de
baño y cocina amb showroom propi a Les Corts (Barcelona). Maqueta de venda:
funciona obrint `index.html` al navegador.

## Com es fa servir

- Obrir `index.html`. No cal servidor ni compilació.
- Els fitxers de `js/` es carreguen amb `defer`. La calculadora i la valoració
  de Google funcionen sense servidor (la valoració, amb el fallback escrit a
  l'HTML si s'obre amb `file://`).

## Estructura

```
innovalini/
├─ index.html            Portada (hero, serveis, CALCULADORA, Francis, reseñas, showroom, FAQ)
├─ banos.html            Reforma de baño (qué incluye, proceso, estilos, FAQ)
├─ cocinas.html          Reforma de cocina (qué incluye, proceso, FAQ)
├─ showroom.html         El diferencial: showroom de Les Corts + mapa + horario
├─ contacto.html         Formulario (Formspree) + datos + mapa
├─ aviso-legal.html      Legal — noindex (camps [ENTRE CLAUDÀTORS] per omplir)
├─ politica-privacidad.html   Legal — noindex
├─ politica-cookies.html      Legal — noindex
├─ css/styles.css        Tots els estils, tokens a :root
├─ js/main.js            Menú mòbil, reveals, countup, formulari, loader de reviews.json
├─ js/calculadora.js     Element signatura: calculadora orientativa de reforma
├─ data/reviews.json     Valoració de Google (fallback + auto-actualització)
├─ assets/
│  ├─ logo-innovalini.png   Logo real descarregat de la seva web
│  ├─ favicon.svg           Favicon derivat de la icona del logo
│  └─ img/                  Fotos (vegeu inventari)
└─ .github/workflows/update-reviews.yml   Auto-actualització de la valoració (cal PLACE_ID + API key)
```

## Paleta i tipografia (resum; justificació completa al PLA.md)

- **Colors:** ceràmica `#F6F3EE`, petroli `#114A55` / `#0A333C`, coure `#B4531F`
  / `#D97E4A`, gris del logo `#999999`. Definits a `:root` de `css/styles.css`.
- **Tipografia:** Archivo (títols en minúscules amb tracking, cos) + Lora itàlica
  (eyebrows i accents, eco del lema cal·ligràfic del logo). Via Google Fonts.

## Inventari de fotos — SUBSTITUIR per material real d'Innovalini

Totes les imatges de `assets/img/` són **provisionals**, descarregades de la web
actual d'innovalini.com (renders 3D amb marca d'aigua + fotos reals de Francis).
Cada `<img>` d'stock/provisional té a sobre un comentari
`<!-- FOTO REAL PENDENT: … -->` cercable. Cal confirmar drets d'ús i, idealment,
substituir per fotos d'obres reals acabades (sobretot **falten cuines reals**).

| Fitxer actual | On s'usa | Reemplaçar per | Format ideal |
|---|---|---|---|
| `hero-bano.jpg` (1136×1133) | Hero portada | Foto real de baño acabado, apaïsada o quadrada | JPG ≥1600px, ~16:10 |
| `bano-marmol.jpg` (1135×1137) | Servei baño (home) + galeria baños | Baño de mármol real | JPG ≥1200px |
| `bano-nordico.jpg` (972×973) | Servei cocina (home) + galeria baños | **Cocina reformada real** (ara hi ha un baño de substitut) | JPG ≥1200px |
| `bano-cobre.jpg` (968×970) | Galeria baños | Baño real (estil càlid) | JPG ≥1200px |
| `ducha-obra.jpg` (1137×1146) | Franja showroom (home) | Interior real del showroom | JPG ≥1400px |
| `francis-asesoramiento.jpg` (855×1088) | Secció Francis + showroom | Foto real de Francis assessorant (aquesta ja és real) | JPG vertical ≥1000px |
| `francis-retrato.jpg` (805×1103) | (disponible, no col·locada) | Retrat de Francis | JPG vertical |
| `logo-innovalini.png` (260×213) | — (referència; el nav usa un SVG propi) | Logo en alta resolució / vectorial (SVG o PNG transparent gran) | SVG o PNG ≥800px |

**Fotos que falten i cal demanar:** 2–3 cuines reals acabades, interior del
showroom, alguna obra en procés, i el logo en vectorial.

## Coses marcades com a pendents (cercables)

- `XXXXXXXX` — ID de Formspree a `contacto.html` (crear compte amb hola@innovalini.com).
- `FOTO REAL PENDENT` — cada imatge provisional.
- `[FECHA]`, `[RAZÓN SOCIAL DE LA EMPRESA]`, `[NIF]`, `[DATOS DEL REGISTRO...]` — camps legals.
- `PENDENT_DE_CONFIGURAR` — PLACE_ID del workflow de ressenyes.

## Valoració de Google automàtica

`data/reviews.json` conté la valoració (4,9★ · 37 reseñas, dada de prospecció
del 11/07/2026). `js/main.js` la llegeix i actualitza els elements amb
`data-reviews`. El workflow `.github/workflows/update-reviews.yml` la refresca
2×/dia via Places API: cal posar el **PLACE_ID** real i el secret **GOOGLE_API_KEY**.
Només s'activa si es publica a un repositori GitHub (fora de l'abast d'aquesta
maqueta).
