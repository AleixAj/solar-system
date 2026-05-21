import { Suspense, useState, useCallback, useEffect, useMemo, lazy } from "react";
import { SolarSystemCanvas } from "./components/Scene/SolarSystemCanvas";
import { Lights } from "./components/Scene/Lights";
import { Sun } from "./components/Scene/Sun";
import { Planet } from "./components/Scene/Planet";
import { Orbit } from "./components/Scene/Orbit";
import { StarField } from "./components/Scene/StarField";
import { Header } from "./components/UI/Header";
import { ShootingStarOverlay } from "./components/UI/ShootingStarOverlay";
import { FloatingMenuButton } from "./components/UI/FloatingMenuButton";
import { GuidedTourControl } from "./components/UI/GuidedTourControl.tsx";
import { PlanetDrawer } from "./components/UI/PlanetDrawer";
import { LoadingOverlay } from "./components/UI/LoadingScreen";

// Heavy UI panels are code-split so the initial WebGL scene can mount faster.
const PlanetInfo = lazy(() =>
  import("./components/UI/PlanetInfo").then((m) => ({ default: m.PlanetInfo }))
);
const PlanetNavigation = lazy(() =>
  import("./components/UI/PlanetNavigation").then((m) => ({ default: m.PlanetNavigation }))
);
const TimeControl = lazy(() =>
  import("./components/UI/TimeControl").then((m) => ({ default: m.TimeControl }))
);
const AboutModal = lazy(() =>
  import("./components/UI/AboutModal").then((m) => ({ default: m.AboutModal }))
);

import { planets } from "./data/planets";
import { useLanguage } from "./context/LanguageContext";
import { usePlanetSelection } from "./hooks/usePlanetSelection";
import { getOrbitRadius } from "./utils/orbitUtils";
import type { Planet as PlanetType } from "./types/planet";

function App() {
  const { getPlanetName, language, t } = useLanguage();
  const { selectedPlanet, selectPlanet, deselectPlanet } = usePlanetSelection();
  const [overviewTrigger, setOverviewTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);   // ← Nuevo estado
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  // The Sun is stored in the same data source as planets so it can share
  // selection, translations and info-panel behaviour.
  const sun = useMemo(
    () => planets.find((p) => p.type === "star") ?? planets[0],
    []
  );
  const planetsToRender = useMemo(
    () => planets.filter((p) => p.type !== "star"),
    []
  );
  const tourPlan = useMemo(() => planets, []);

  // Centralized selection path used by manual navigation and the guided tour.
  // Keeping this in one callback prevents UI layers from drifting out of sync.
  const focusPlanet = useCallback((planet: PlanetType) => {
    selectPlanet(planet);
    setPanelVisible(true);
    setDrawerOpen(false);
  }, [selectPlanet]);

  const handleSelectPlanet = useCallback((planet: PlanetType) => {
    // Manual selection takes control away from the guided tour.
    setTourActive(false);
    setTourPaused(false);
    focusPlanet(planet);
  }, [focusPlanet]);

  const handleDeselectPlanet = useCallback(() => {
    setTourActive(false);
    setTourPaused(false);
    deselectPlanet();
    setPanelVisible(false);
  }, [deselectPlanet]);

  const handleOverview = useCallback(() => {
    setTourActive(false);
    setTourPaused(false);
    deselectPlanet();
    setPanelVisible(false);
    setOverviewTrigger((t) => t + 1);
  }, [deselectPlanet]);

  const focusTourStep = useCallback((index: number) => {
    // Wrap around so the tour can loop indefinitely without extra boundary UI.
    const nextIndex = (index + tourPlan.length) % tourPlan.length;
    setTourIndex(nextIndex);
    focusPlanet(tourPlan[nextIndex]);
  }, [focusPlanet, tourPlan]);

  const startTour = useCallback(() => {
    setTourActive(true);
    setTourPaused(false);
    // Collapse the desktop sidebar to give the 3D scene a more cinematic frame.
    setNavCollapsed(true);
    focusTourStep(0);
  }, [focusTourStep]);

  const stopTour = useCallback(() => {
    setTourActive(false);
    setTourPaused(false);
  }, []);

  const nextTourStep = useCallback(() => {
    focusTourStep(tourIndex + 1);
  }, [focusTourStep, tourIndex]);

  const previousTourStep = useCallback(() => {
    focusTourStep(tourIndex - 1);
  }, [focusTourStep, tourIndex]);

  useEffect(() => {
    if (!tourActive || tourPaused || tourPlan.length === 0) return;

    // Auto-advance keeps the tour hands-free; users can still pause or step
    // manually via the control panel.
    const timer = window.setTimeout(() => {
      focusTourStep(tourIndex + 1);
    }, 7200);

    return () => window.clearTimeout(timer);
  }, [focusTourStep, tourActive, tourIndex, tourPaused, tourPlan.length]);

  useEffect(() => {
    // Keep the document language aligned with the UI language for screen readers.
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Global Escape handling mirrors native app behaviour: close the topmost
    // transient layer first, then fall back to hiding contextual panels.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (aboutOpen) {
        setAboutOpen(false);
        return;
      }

      if (drawerOpen) {
        setDrawerOpen(false);
        return;
      }

      if (tourActive) {
        stopTour();
        return;
      }

      if (selectedPlanet && panelVisible) {
        setPanelVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aboutOpen, drawerOpen, panelVisible, selectedPlanet, stopTour, tourActive]);

  const handleFabClick = useCallback(() => {
    if (selectedPlanet) {
      setPanelVisible((v) => !v);
    } else {
      setDrawerOpen((v) => !v);
    }
  }, [selectedPlanet]);

  const fabIsActive = selectedPlanet ? panelVisible : drawerOpen;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans">
      <a
        href="#scene-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-xl focus:bg-yellow-400 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        {language === "es" ? "Saltar a la escena" : "Skip to scene"}
      </a>
      <LoadingOverlay />

      <SolarSystemCanvas
        onBackgroundClick={handleDeselectPlanet}
        selectedPlanet={selectedPlanet}
        overviewTrigger={overviewTrigger}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <StarField />
          <Lights />
          <Sun sun={sun} onSelect={handleSelectPlanet} />
          {planetsToRender.map((planet) => (
            <Orbit
              key={`orbit-${planet.id}`}
              radius={getOrbitRadius(planet.distanceFromSun, planet.id)}
            />
          ))}
          {planetsToRender.map((planet, index) => (
            <Planet
              key={planet.id}
              planet={planet}
              index={index}
              onSelect={handleSelectPlanet}
              isSelected={selectedPlanet?.id === planet.id}
            />
          ))}
        </Suspense>
      </SolarSystemCanvas>

      {/* Hidden landmark target for keyboard users using the skip link. */}
      <main id="scene-content" tabIndex={-1} className="sr-only">
        {language === "es"
          ? "Escena interactiva del Sistema Solar"
          : "Interactive Solar System scene"}
      </main>

      <ShootingStarOverlay />

      {/* UI is rendered above the Canvas with pointer-events opt-in per widget. */}
      <div className="absolute inset-0 pointer-events-none">
        <Header onOpenAbout={() => setAboutOpen(true)} />

        <GuidedTourControl
          active={tourActive}
          paused={tourPaused}
          currentIndex={tourIndex}
          total={tourPlan.length}
          currentPlanet={tourPlan[tourIndex]}
          onStart={startTour}
          onStop={stopTour}
          onPrevious={previousTourStep}
          onNext={nextTourStep}
          onTogglePause={() => setTourPaused((paused) => !paused)}
        />

        <Suspense fallback={null}>
          <PlanetNavigation
            planets={planets}
            selectedPlanet={selectedPlanet}
            onSelectPlanet={handleSelectPlanet}
            onOverview={handleOverview}
            collapsed={navCollapsed}
            onToggleCollapsed={() => setNavCollapsed((c) => !c)}
          />

          {selectedPlanet && panelVisible && (
            <PlanetInfo
              planet={selectedPlanet}
              onCollapse={() => setPanelVisible(false)}
              onClose={handleDeselectPlanet}
            />
          )}

          <TimeControl />
        </Suspense>

        <FloatingMenuButton
          isOpen={fabIsActive}
          hasPlanetSelected={!!selectedPlanet}
          onClick={handleFabClick}
        />

        <PlanetDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSelectPlanet={handleSelectPlanet}
          planets={planets}
          selectedPlanet={selectedPlanet}
        />
      </div>

      <Suspense fallback={null}>
        <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      </Suspense>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedPlanet
          ? `${t("viewing")} ${getPlanetName(selectedPlanet)}`
          : `${t("overview")} — ${t("solarSystem")}`}
      </div>
    </div>
  );
}

export default App;