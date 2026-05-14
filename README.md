# Solar Explorer

Sistema Solar 3D interactivo construido como proyecto web personal.

Solar Explorer combina una escena 3D en tiempo real, datos astronómicos y una interfaz cuidada para crear una forma inmersiva de explorar el Sistema Solar desde el navegador.

[Demo en vivo](https://solar.aleixaj.com) · [Repositorio](https://github.com/AleixAj/solar-system)

## Enfoque del proyecto

Este es un proyecto personal dedicado, pensado para crecer con el tiempo. El objetivo es construir una experiencia interactiva completa, no solo una demo estática: una escena 3D navegable, UI responsive, información contextual, soporte de idioma y una base de código mantenible.

Objetivos principales:

- Crear una experiencia inmersiva en navegador con React y Three.js.
- Mantener una interfaz limpia, responsive y fácil de navegar.
- Estructurar el código con componentes reutilizables, datos tipados y hooks específicos.
- Resolver la interacción entre UI DOM y contenido WebGL.
- Dejar el proyecto preparado para futuras mejoras como tour guiado, más detalle de lunas y modos de cámara cinematográficos.

## Características

- Escena 3D interactiva del Sistema Solar con React Three Fiber.
- Sol y planetas seleccionables, con transiciones de cámara y paneles contextuales.
- Tooltips en la escena con datos de diámetro.
- Navegación lateral, drawer móvil y controles flotantes.
- Control de velocidad temporal de `0x` a `10x`, con `0.25x` como valor inicial.
- Campo de estrellas lejanas para dar profundidad.
- Selector de idioma ES/EN con preferencia persistente.
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
- Modelado de datos tipado para planetas y satélites.
- Composición de escena 3D con meshes, materiales, texturas y controles de cámara.
- Gestión de estado con React Context y hooks personalizados.
- Patrones de interacción responsive para desktop y móvil.
- Cuidado de UI/UX: modales, drawers, hover states, estados activos y etiquetas de accesibilidad.
- Internacionalización sin añadir dependencias innecesarias.

## Desarrollo local

```bash
git clone https://github.com/AleixAj/solar-system.git
cd solar-system
pnpm install
pnpm dev
```

Abre `http://localhost:5173`.

Comandos útiles:

```bash
pnpm run lint
pnpm run build
pnpm run preview
```

## Roadmap

- Modo tour guiado para visitar automáticamente cada planeta.
- Modo pantalla completa y captura de pantalla.
- Más información e interacciones para lunas.
- Presets de cámara más cinematográficos.
- Más división de bundle para optimizar la escena Three.js.

## Sobre el proyecto

Hecho por Aleix Aj como proyecto web personal centrado en exploración 3D, arquitectura limpia y una experiencia de usuario cuidada.