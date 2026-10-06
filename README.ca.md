# Solar Explorer

![React](https://img.shields.io/badge/React-19-149eca?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.183-000000?style=flat&logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9-61dafb?style=flat&logo=react&logoColor=111111)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat&logo=tailwindcss&logoColor=white)

<p>
  <a href="README.md"><img src="docs/readme/lang-es.svg" alt="Español" width="170"></a>
  <a href="README.en.md"><img src="docs/readme/lang-en.svg" alt="English" width="170"></a>
  <img src="docs/readme/lang-ca-active.svg" alt="Català" width="170">
</p>

Sistema Solar 3D interactiu construït com a projecte web personal.

Solar Explorer combina una escena 3D en temps real, dades astronòmiques i una interfície acurada per crear una manera immersiva d'explorar el Sistema Solar des del navegador.

[Demo en directe](https://solar.aleixaj.com) · [Repositori](https://github.com/AleixAj/solar-system)

## Enfocament del projecte

Aquest és un projecte personal pensat per créixer amb el temps. L'objectiu és construir una experiència interactiva completa, no només una demo estàtica: una escena 3D navegable, UI responsive, informació contextual, suport d'idioma i una base de codi mantenible.

Objectius principals:

- Crear una experiència immersiva al navegador amb React, Three.js i React Three Fiber.
- Mantenir una interfície neta, responsive i fàcil de navegar a l'escriptori i al mòbil.
- Estructurar el codi amb components reutilitzables, dades tipades i hooks específics.
- Resoldre la interacció entre la UI DOM, el contingut WebGL, els overlays i els controls de càmera.
- Deixar el projecte preparat per a futures millores visuals sense dependre de models 3D pesants.

## Característiques

- Escena 3D interactiva del Sistema Solar amb React Three Fiber.
- Sol i planetes seleccionables, amb transicions de càmera i panells contextuals.
- Tour guiat/cinemàtic per recórrer automàticament els astres principals.
- Panell lateral d'escriptori amb navegació per astres, estat actiu i mode plegable.
- Drawer mòbil i botons flotants per obrir la llista de planetes o el panell d'informació a demanda.
- Panell d'informació per planeta amb dades físiques, moviment, llunes conegudes i curiositats.
- Tooltips a l'escena amb dades ràpides.
- Control de velocitat temporal de `0x` a `10x`, amb `0.25x` com a valor inicial.
- Fons espacial texturitzat amb una imatge optimitzada, cometes fugaços subtils en un overlay CSS i logotip mòbil enllaçat al portfolio.
- Il·luminació realista: tota la llum surt del Sol, així que cada planeta té la cara de dia i la de nit.
- Resplendor (bloom) al voltant del Sol i vinyetatge, només a escriptori.
- Atmosferes amb shader propi que només brillen a la vora i a la cara il·luminada.
- Anells de Saturn generats per shader, amb divisions i l'ombra del planeta projectada a sobre.
- Cinturó d'asteroides entre Mart i Júpiter amb 1.800 roques en una sola crida de dibuix.
- Estrelles en tres capes de mida i brillantor diferents sobre el fons espacial.
- Selector d'idioma ES/EN amb preferència persistent.
- Modal "Sobre el proyecto" (Sobre el projecte) amb tecnologies, estructura general i enllaços.
- UI fosca i responsive construïda amb Tailwind CSS.
- Panells carregats de manera diferida i precàrrega de textures per a una experiència més fluida.

## Tecnologies

- React 19
- TypeScript
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- Tailwind CSS
- @react-three/postprocessing

## Aspectes tècnics destacats

- Arquitectura d'UI basada en components React.
- Modelatge de dades tipat per a planetes, satèl·lits i contingut traduïble.
- Composició d'escena 3D amb meshes, materials, textures, atmosferes, fons espacial, òrbites i controls de càmera.
- Gestió d'estat amb React Context i hooks personalitzats.
- Patrons d'interacció responsive per a escriptori i mòbil.
- Overlays DOM sobre WebGL per a efectes lleugers com els cometes fugaços, independents del fons 3D.
- Cura de la UI/UX: tour guiat, modals, drawers, botons flotants mòbils, estats hover, estats actius, z-index, scroll intern i etiquetes d'accessibilitat.
- Internacionalització ES/EN sense afegir dependències innecessàries.

## Qualitat frontend

- Tour guiat amb càmera animada i seguiment en directe del planeta mentre orbita.
- UX mòbil pensada per no envair l'escena: la selecció de planetes no obre automàticament la fitxa, i els accessos a info/llista queden disponibles a dalt.
- Microinteraccions d'UI amb transicions, estats actius i `prefers-reduced-motion`.
- Realisme sense models pesants: la llum surt d'un sol punt, i atmosferes, anells i resplendor del Sol es dibuixen amb shaders, sprites i instàncies.
- Fons espacial com una esfera invertida dins del Canvas, amb unes poques capes de punts a sobre per als estels propers.
- Accessibilitat aplicada en punts clau: `Escape` per tancar capes, focus visible, `aria-label`, `aria-current`, idioma dinàmic i skip link.
- Rendiment visual acurat: DPR adaptatiu, esferes, llunes i asteroides simplificats al mòbil, efectes de postprocessat desactivats allà (i el seu codi ni tan sols es descarrega), overlays decoratius desactivats amb `prefers-reduced-motion` i panells carregats a demanda.
- Separació clara entre l'escena WebGL (`Scene`), la UI (`UI`), l'estat (`context`), els hooks i les dades.
- Comentaris en anglès a les zones de lògica més rellevants per facilitar la revisió tècnica del codi.

## Estructura del codi

```txt
src/
├── components/
│   ├── Scene/       # Canvas, càmera, planetes, òrbites, llums, fons i efectes
│   └── UI/          # Header, tour guiat, panells, drawer, modal i controls
├── context/         # Idioma i intensitat temporal de la simulació
├── data/            # Dades tipades de planetes i satèl·lits
├── hooks/           # Animació de càmera, moviment, selecció i responsive
└── utils/           # Radis d'òrbita i nombres aleatoris estables
```

## Desenvolupament local

```bash
git clone https://github.com/AleixAj/solar-system.git
cd solar-system
pnpm install
pnpm dev
```

Obre `http://localhost:5173`.

Ordres útils:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Full de ruta

- Narrativa més rica per al tour guiat amb textos específics per planeta.
- Mode de pantalla completa i captura de pantalla.
- Més informació i interaccions per a les llunes.
- Presets de càmera més cinematogràfics.
- Continuar dividint el bundle de Three.js perquè la primera càrrega sigui més lleugera.
- Textures optimitzades addicionals per millorar el realisme dels planetes sense comprometre la fluïdesa.

## Sobre el projecte

Fet per Aleix Aj com a projecte web personal centrat en l'exploració 3D, l'arquitectura neta i una experiència d'usuari acurada.