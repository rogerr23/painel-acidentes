import { AccidentTable } from "./components/AccidentTable";
import { DashboardHeader } from "./components/DashboardHeader";
import { FilterPanel } from "./components/FilterPanel";
import { IndicatorCard } from "./components/IndicatorCard";
import { MapPlaceholder } from "./components/MapPlaceholder";
import { indicadoresSimulados } from "./data/mockData";
import { useAcidentes } from "./hooks/useAcidentes";

export function App() {
  const { acidentes, total, carregando, erro } = useAcidentes();

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
          <AccidentTable
            acidentes={acidentes}
            total={total}
            carregando={carregando}
            erro={erro}
          />
        </section>
      </main>

      <footer className="app-footer">
        Indicadores simulados para construção da interface.
      </footer>
    </div>
  );
}
