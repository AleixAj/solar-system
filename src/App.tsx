import { Suspense, useState, useCallback, useMemo, lazy } from "react";
import { SolarSystemCanvas } from "./components/Scene/SolarSystemCanvas";
import { Lights } from "./components/Scene/Lights";
import { Sun } from "./components/Scene/Sun";
import { Planet } from "./components/Scene/Planet";
import { Orbit } from "./components/Scene/Orbit";
import { StarField } from "./components/Scene/StarField";
import { Header } from "./components/UI/Header";
import { ShootingStarOverlay } from "./components/UI/ShootingStarOverlay";
import { FloatingMenuButton } from "./components/UI/FloatingMenuButton";
import { PlanetDrawer } from "./components/UI/PlanetDrawer";
import { LoadingOverlay } from "./components/UI/LoadingScreen";
import { AboutModal } from "./components/UI/AboutModal";   // ← Añadido

const PlanetInfo = lazy(() =>
  import("./components/UI/PlanetInfo").then((m) => ({ default: m.PlanetInfo }))
);
const PlanetNavigation = lazy(() =>
  import("./components/UI/PlanetNavigation").then((m) => ({ default: m.PlanetNavigation }))
);
const TimeControl = lazy(() =>
  import("./components/UI/TimeControl").then((m) => ({ default: m.TimeControl }))
);

import { planets } from "./data/planets";
import { useLanguage } from "./context/LanguageContext";
import { usePlanetSelection } from "./hooks/usePlanetSelection";
import { getOrbitRadius } from "./utils/orbitUtils";
import type { Planet as PlanetType } from "./types/planet";

function App() {
  const { getPlanetName, t } = useLanguage();
  const { selectedPlanet, selectPlanet, deselectPlanet } = usePlanetSelection();
  const [overviewTrigger, setOverviewTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);   // ← Nuevo estado
  const [navCollapsed, setNavCollapsed] = useState(false);

  const sun = useMemo(
    () => planets.find((p) => p.type === "star") ?? planets[0],
    []
  );
  const planetsToRender = useMemo(
    () => planets.filter((p) => p.type !== "star"),
    []
  );

  const handleSelectPlanet = useCallback((planet: PlanetType) => {
    selectPlanet(planet);
    setPanelVisible(true);
    setDrawerOpen(false);
  }, [selectPlanet]);

  const handleDeselectPlanet = useCallback(() => {
    deselectPlanet();
    setPanelVisible(false);
  }, [deselectPlanet]);

  const handleOverview = useCallback(() => {
    deselectPlanet();
    setPanelVisible(false);
    setOverviewTrigger((t) => t + 1);
  }, [deselectPlanet]);

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

      <ShootingStarOverlay />

      <div className="absolute inset-0 pointer-events-none">
        <Header onOpenAbout={() => setAboutOpen(true)} />   {/* ← Añadido prop */}

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

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedPlanet
          ? `${t("viewing")} ${getPlanetName(selectedPlanet)}`
          : `${t("overview")} — ${t("solarSystem")}`}
      </div>
    </div>
  );
}

export default App;