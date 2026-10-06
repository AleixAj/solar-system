import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Planet, Satellite } from "../types/planet";

/**
 * Spanish and English texts for the whole app, with no i18n library.
 *
 * UI labels live in TRANSLATIONS and are read with t("key"). Planet names,
 * facts and moon names are translated with the get* helpers, because the
 * English version of those is already in the planet data.
 */

export type Language = "en" | "es";

/**
 * English texts. They also define the list of valid keys: every key added here
 * must be added to the Spanish block too, or TypeScript complains.
 */
const EN_TEXTS = {
  aboutButton: "About this project",
  aboutClose: "Close",
  aboutDuration: "Project scope:",
  aboutFocus: "Focus:",
  aboutFocusValue: "Evolving personal project focused on product feel and interaction",
  aboutLearned: "General structure",
  aboutProject: "About this project",
  aboutScopeValue: "Complete web experience: 3D scene, UI, responsive layout and language support",
  aboutTech: "Technologies",
  aboutViewCode: "View code on GitHub",
  center: "Center",
  collapseSidebar: "Hide sidebar",
  craftedBy: "by",
  craftedWith: "Crafted with",
  diameter: "Diameter",
  didYouKnow: "Did you know?",
  distanceFromSun: "Distance from Sun",
  expandSidebar: "Show sidebar",
  guidedTour: "Guided tour",
  hidePlanetInfo: "Hide planet info",
  languageSelector: "Language selector",
  interactiveSimulation: "Interactive 3D Simulation",
  knownMoons: "Known Moons",
  motion: "Motion",
  nextTourStep: "Next tour step",
  openPlanetMenu: "Open planet menu",
  openPortfolio: "Open Aleix's portfolio",
  orbitSpeed: "Orbit Speed",
  overview: "Overview",
  pause: "Pause simulation",
  pauseGuidedTour: "Pause guided tour",
  physicalData: "Physical Data",
  planetInfoPanel: "Planet information panel",
  planetNavAria: "Planets and overview navigation",
  previousTourStep: "Previous tour step",
  resume: "Resume simulation",
  resumeGuidedTour: "Resume guided tour",
  rotationSpeed: "Rotation Speed",
  satellites: "Satellites",
  sceneDescription: "Interactive Solar System scene",
  skipToScene: "Skip to scene",
  showPlanetInfo: "Show planet info",
  solarSystem: "Solar System",
  speed: "SPEED",
  startGuidedTour: "Start guided tour",
  stopGuidedTour: "Stop guided tour",
  systemRole: "System Role",
  temperature: "Temperature",
  viewing: "Viewing",
};

type TranslationKey = keyof typeof EN_TEXTS;

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  en: EN_TEXTS,
  es: {
    aboutButton: "Sobre el proyecto",
    aboutClose: "Cerrar",
    aboutDuration: "Alcance del proyecto:",
    aboutFocus: "Enfoque:",
    aboutFocusValue: "Proyecto personal evolutivo con foco en producto e interacción",
    aboutLearned: "Estructura general",
    aboutProject: "Sobre este proyecto",
    aboutScopeValue: "Experiencia web completa: escena 3D, UI, responsive e idioma",
    aboutTech: "Tecnologías",
    aboutViewCode: "Ver código en GitHub",
    center: "Centro",
    collapseSidebar: "Ocultar panel lateral",
    craftedBy: "por",
    craftedWith: "Hecho con",
    diameter: "Diámetro",
    didYouKnow: "¿Sabías que?",
    distanceFromSun: "Distancia al Sol",
    expandSidebar: "Mostrar panel lateral",
    guidedTour: "Tour guiado",
    hidePlanetInfo: "Ocultar información",
    languageSelector: "Selector de idioma",
    interactiveSimulation: "Simulación 3D interactiva",
    knownMoons: "Lunas conocidas",
    motion: "Movimiento",
    nextTourStep: "Siguiente paso del tour",
    openPlanetMenu: "Abrir menú de astros",
    openPortfolio: "Abrir el portfolio de Aleix",
    orbitSpeed: "Velocidad orbital",
    overview: "Vista general",
    pause: "Pausar simulación",
    pauseGuidedTour: "Pausar tour guiado",
    physicalData: "Datos físicos",
    planetInfoPanel: "Panel de información del astro",
    planetNavAria: "Navegación: planetas y vista general",
    previousTourStep: "Paso anterior del tour",
    resume: "Reanudar simulación",
    resumeGuidedTour: "Reanudar tour guiado",
    rotationSpeed: "Velocidad de rotación",
    satellites: "Satélites",
    sceneDescription: "Escena interactiva del Sistema Solar",
    skipToScene: "Saltar a la escena",
    showPlanetInfo: "Mostrar información",
    solarSystem: "Sistema Solar",
    speed: "VELOCIDAD",
    startGuidedTour: "Iniciar tour guiado",
    stopGuidedTour: "Cerrar tour guiado",
    systemRole: "Rol en el sistema",
    temperature: "Temperatura",
    viewing: "Viendo",
  },
};

/** Label for the family of each body, shown in the info panel. */
const TYPE_LABELS: Record<Language, Record<Planet["type"], string>> = {
  en: {
    terrestrial: "Terrestrial",
    "gas-giant": "Gas Giant",
    "ice-giant": "Ice Giant",
    star: "Star",
  },
  es: {
    terrestrial: "Rocoso",
    "gas-giant": "Gigante gaseoso",
    "ice-giant": "Gigante helado",
    star: "Estrella",
  },
};

/** Spanish name and fact per planet. English ones come from the planet data. */
const PLANET_TRANSLATIONS: Record<string, { es: { name: string; funFact: string } }> = {
  sun: {
    es: {
      name: "Sol",
      funFact:
        "El Sol es una enorme esfera de plasma caliente y aporta casi toda la energía del Sistema Solar.",
    },
  },
  mercury: {
    es: {
      name: "Mercurio",
      funFact: "Mercurio es el planeta más rápido: completa una órbita alrededor del Sol en 88 días terrestres.",
    },
  },
  venus: {
    es: {
      name: "Venus",
      funFact: "Venus es el planeta más caliente y gira en sentido retrógrado, al contrario que la mayoría.",
    },
  },
  earth: {
    es: {
      name: "Tierra",
      funFact: "La Tierra es el único planeta conocido con vida y reúne las condiciones perfectas para el agua líquida.",
    },
  },
  mars: {
    es: {
      name: "Marte",
      funFact: "Marte es conocido como el planeta rojo por el óxido de hierro presente en su superficie.",
    },
  },
  jupiter: {
    es: {
      name: "Júpiter",
      funFact: "Júpiter es el planeta más grande: en su interior cabrían más de 1.300 Tierras.",
    },
  },
  saturn: {
    es: {
      name: "Saturno",
      funFact: "Los icónicos anillos de Saturno están formados por miles de millones de fragmentos de hielo y roca.",
    },
  },
  uranus: {
    es: {
      name: "Urano",
      funFact: "Urano rota prácticamente de lado, con una inclinación axial extrema de 98 grados.",
    },
  },
  neptune: {
    es: {
      name: "Neptuno",
      funFact: "Neptuno tiene los vientos más intensos del Sistema Solar, con velocidades de hasta 2.100 km/h.",
    },
  },
};

/** Only the moons whose name changes in Spanish need an entry here. */
const SATELLITE_TRANSLATIONS: Record<string, { es: string }> = {
  Moon: { es: "Luna" },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  getPlanetName: (planet: Planet) => string;
  getPlanetFunFact: (planet: Planet) => string;
  getSatelliteName: (satellite: Satellite) => string;
  getTypeLabel: (type: Planet["type"]) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  const stored = window.localStorage.getItem("solar-system-language");
  if (stored === "en" || stored === "es") return stored;

  return window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("solar-system-language", nextLanguage);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => TRANSLATIONS[language][key],
      getPlanetName: (planet) =>
        language === "es" ? PLANET_TRANSLATIONS[planet.id]?.es.name ?? planet.name : planet.name,
      getPlanetFunFact: (planet) =>
        language === "es" ? PLANET_TRANSLATIONS[planet.id]?.es.funFact ?? planet.funFact : planet.funFact,
      getSatelliteName: (satellite) =>
        language === "es" ? SATELLITE_TRANSLATIONS[satellite.name]?.es ?? satellite.name : satellite.name,
      getTypeLabel: (type) => TYPE_LABELS[language][type],
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
