import { AccidentTable } from "./components/AccidentTable";
import { DashboardHeader } from "./components/DashboardHeader";
import { FilterPanel } from "./components/FilterPanel";
import { IndicatorCard } from "./components/IndicatorCard";
import { MapPlaceholder } from "./components/MapPlaceholder";
import { acidentesSimulados, indicadoresSimulados } from "./data/mockData";

export function App() {
  return (
    <div className="app-shell">
      <DashboardHeader />

      <main className="dashboard">
        <FilterPanel />

        <section className="indicator-grid" aria-label="Indicadores gerais">
          {indicadoresSimulados.map((indicador) => (
            <IndicatorCard key={indicador.label} {...indicador} />
          ))}
        </section>

        <section className="dashboard-grid">
          <MapPlaceholder />
          <AccidentTable acidentes={acidentesSimulados} />
        </section>
      </main>

      <footer className="app-footer">
        Dados simulados para construção da interface.
      </footer>
    </div>
  );
}
