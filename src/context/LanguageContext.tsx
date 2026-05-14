import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Planet, Satellite } from "../types/planet";

export type Language = "en" | "es";

type TranslationKey =
  | "aboutButton"
  | "aboutClose"
  | "aboutDuration"
  | "aboutLearned"
  | "aboutProject"
  | "aboutTech"
  | "aboutViewCode"
  | "center"
  | "clickToExplore"
  | "collapseSidebar"
  | "craftedBy"
  | "craftedWith"
  | "diameter"
  | "didYouKnow"
  | "distanceFromSun"
  | "expandSidebar"
  | "hidePlanetInfo"
  | "interactiveSimulation"
  | "knownMoons"
  | "motion"
  | "openPlanetMenu"
  | "orbitSpeed"
  | "overview"
  | "pause"
  | "physicalData"
  | "planetNavAria"
  | "resume"
  | "rotationSpeed"
  | "satellites"
  | "showPlanetInfo"
  | "solarSystem"
  | "speed"
  | "systemRole"
  | "temperature"
  | "viewing";

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  en: {
    aboutButton: "About this project",
    aboutClose: "Close",
    aboutDuration: "Project scope:",
    aboutLearned: "General structure",
    aboutProject: "About this project",
    aboutTech: "Technologies",
    aboutViewCode: "View code on GitHub",
    center: "Center",
    clickToExplore: "Click to explore",
    collapseSidebar: "Hide sidebar",
    craftedBy: "by",
    craftedWith: "Crafted with",
    diameter: "Diameter",
    didYouKnow: "Did you know?",
    distanceFromSun: "Distance from Sun",
    expandSidebar: "Show sidebar",
    hidePlanetInfo: "Hide planet info",
    interactiveSimulation: "Interactive 3D Simulation",
    knownMoons: "Known Moons",
    motion: "Motion",
    openPlanetMenu: "Open planet menu",
    orbitSpeed: "Orbit Speed",
    overview: "Overview",
    pause: "Pause simulation",
    physicalData: "Physical Data",
    planetNavAria: "Planets and overview navigation",
    resume: "Resume simulation",
    rotationSpeed: "Rotation Speed",
    satellites: "Satellites",
    showPlanetInfo: "Show planet info",
    solarSystem: "Solar System",
    speed: "SPEED",
    systemRole: "System Role",
    temperature: "Temperature",
    viewing: "Viewing",
  },
  es: {
    aboutButton: "Sobre el proyecto",
    aboutClose: "Cerrar",
    aboutDuration: "Alcance del proyecto:",
    aboutLearned: "Estructura general",
    aboutProject: "Sobre este proyecto",
    aboutTech: "Tecnologías",
    aboutViewCode: "Ver código en GitHub",
    center: "Centro",
    clickToExplore: "Haz click para explorar",
    collapseSidebar: "Ocultar panel lateral",
    craftedBy: "por",
    craftedWith: "Hecho con",
    diameter: "Diámetro",
    didYouKnow: "¿Sabías que?",
    distanceFromSun: "Distancia al Sol",
    expandSidebar: "Mostrar panel lateral",
    hidePlanetInfo: "Ocultar información",
    interactiveSimulation: "Simulación 3D interactiva",
    knownMoons: "Lunas conocidas",
    motion: "Movimiento",
    openPlanetMenu: "Abrir menú de astros",
    orbitSpeed: "Velocidad orbital",
    overview: "Vista general",
    pause: "Pausar simulación",
    physicalData: "Datos físicos",
    planetNavAria: "Navegación: planetas y vista general",
    resume: "Reanudar simulación",
    rotationSpeed: "Velocidad de rotación",
    satellites: "Satélites",
    showPlanetInfo: "Mostrar información",
    solarSystem: "Sistema Solar",
    speed: "VELOCIDAD",
    systemRole: "Rol en el sistema",
    temperature: "Temperatura",
    viewing: "Viendo",
  },
};

const TYPE_LABELS: Record<Language, Record<Planet["type"], string>> = {
  en: {
    terrestrial: "Terrestrial",
    "gas-giant": "Gas Giant",
    "ice-giant": "Ice Giant",
    dwarf: "Dwarf Planet",
    star: "Star",
  },
  es: {
    terrestrial: "Rocoso",
    "gas-giant": "Gigante gaseoso",
    "ice-giant": "Gigante helado",
    dwarf: "Planeta enano",
    star: "Estrella",
  },
};

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

const SATELLITE_TRANSLATIONS: Record<string, { es: string }> = {
  Moon: { es: "Luna" },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
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

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "es" : "en");
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (key) => TRANSLATIONS[language][key],
      getPlanetName: (planet) =>
        language === "es" ? PLANET_TRANSLATIONS[planet.id]?.es.name ?? planet.name : planet.name,
      getPlanetFunFact: (planet) =>
        language === "es" ? PLANET_TRANSLATIONS[planet.id]?.es.funFact ?? planet.funFact : planet.funFact,
      getSatelliteName: (satellite) =>
        language === "es" ? SATELLITE_TRANSLATIONS[satellite.name]?.es ?? satellite.name : satellite.name,
      getTypeLabel: (type) => TYPE_LABELS[language][type],
    }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
