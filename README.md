# Solar Explorer

![React](https://img.shields.io/badge/React-19-149eca?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.183-000000?style=flat&logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9-61dafb?style=flat&logo=react&logoColor=111111)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat&logo=tailwindcss&logoColor=white)
![Vercel Analytics](https://img.shields.io/badge/Vercel%20Analytics-2-000000?style=flat&logo=vercel&logoColor=white)

Sistema Solar 3D interactivo construido como proyecto web personal.

Solar Explorer combina una escena 3D en tiempo real, datos astronómicos y una interfaz cuidada para crear una forma inmersiva de explorar el Sistema Solar desde el navegador.

[Demo en vivo](https://solar.aleixaj.com) · [Repositorio](https://github.com/AleixAj/solar-system)

## Enfoque del proyecto

Este es un proyecto personal pensado para crecer con el tiempo. El objetivo es construir una experiencia interactiva completa, no solo una demo estática: una escena 3D navegable, UI responsive, información contextual, soporte de idioma y una base de código mantenible.

Objetivos principales:

- Crear una experiencia inmersiva en navegador con React, Three.js y React Three Fiber.
- Mantener una interfaz limpia, responsive y fácil de navegar en desktop y móvil.
- Estructurar el código con componentes reutilizables, datos tipados y hooks específicos.
- Resolver la interacción entre UI DOM, contenido WebGL, overlays y controles de cámara.
- Dejar el proyecto preparado para futuras mejoras como más detalle de lunas, modos de cámara cinematográficos y microinteracciones avanzadas.

## Características

- Escena 3D interactiva del Sistema Solar con React Three Fiber.
- Sol y planetas seleccionables, con transiciones de cámara y paneles contextuales.
- Tour guiado/cinemático para recorrer automáticamente los principales astros.
- Panel lateral desktop con navegación por astros, estado activo y modo colapsable.
- Drawer móvil y botón flotante para navegar sin ocupar pantalla.
- Panel de información por planeta con datos físicos, movimiento, lunas conocidas y curiosidades.
- Tooltips en escena con datos rápidos.
- Control de velocidad temporal de `0x` a `10x`, con `0.25x` como valor inicial.
- Campo de estrellas lejanas y cometas fugaces sutiles en overlay CSS.
- Selector de idioma ES/EN con preferencia persistente.
- Modal "Sobre el proyecto" con tecnologías, estructura general y enlaces.
- UI oscura y responsive construida con Tailwind CSS.
- Paneles cargados de forma diferida y precarga de texturas para una experiencia más fluida.

## Tecnologías

- React 19
- TypeScript
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- Tailwind CSS
- Vercel Analytics

## Aspectos técnicos destacados

- Arquitectura de UI basada en componentes React.
- Modelado de datos tipado para planetas, satélites y contenido traducible.
- Composición de escena 3D con meshes, materiales, texturas, estrellas, órbitas y controles de cámara.
- Gestión de estado con React Context y hooks personalizados.
- Patrones de interacción responsive para desktop y móvil.
- Overlays DOM sobre WebGL para efectos ligeros como cometas fugaces.
- Cuidado de UI/UX: tour guiado, modales, drawers, hover states, estados activos, z-index, scroll interno y etiquetas de accesibilidad.
- Internacionalización ES/EN sin añadir dependencias innecesarias.

## Calidad frontend

- Tour guiado con cámara animada y seguimiento en vivo del planeta mientras orbita.
- Microinteracciones UI con transiciones, estados activos y `prefers-reduced-motion`.
- Accesibilidad aplicada en puntos clave: `Escape` para cerrar capas, foco visible, `aria-label`, `aria-current`, idioma dinámico y skip link.
- Performance visual cuidada: DPR adaptativo, estrellas reducidas en móvil, overlays decorativos desactivados con `prefers-reduced-motion` y paneles cargados bajo demanda.
- Separación clara entre escena WebGL (`Scene`), UI (`UI`), estado (`context`), hooks y datos.
- Comentarios en inglés en las zonas de lógica más relevante para facilitar la revisión técnica del código.

## Estructura del código

```txt
src/
├── components/
│   ├── Scene/       # Canvas, cámara, planetas, órbitas, luces y estrellas
│   └── UI/          # Header, tour guiado, paneles, drawer, modal y controles
├── context/         # Idioma e intensidad temporal de la simulación
├── data/            # Datos tipados de planetas y satélites
├── hooks/           # Animación de cámara, selección y helpers responsive
├── styles/          # Variables y estilos globales
└── utils/           # Utilidades de escena, escalado y órbitas
```

## Desarrollo local

```bash
git clone https://github.com/AleixAj/solar-system.git
cd solar-system
npm install
npm run dev
```

Abre `http://localhost:5173`.

Comandos útiles:

```bash
npm run lint
npm run build
npm run preview
```

## Roadmap

- Narrativa más rica para el tour guiado con textos específicos por planeta.
- Modo pantalla completa y captura de pantalla.
- Más información e interacciones para lunas.
- Presets de cámara más cinematográficos.
- Más división de bundle para optimizar la escena Three.js.
- Ajustes visuales adicionales para densidad de estrellas, cometas y escalas.

## Sobre el proyecto

Hecho por Aleix Aj como proyecto web personal centrado en exploración 3D, arquitectura limpia y una experiencia de usuario cuidada.