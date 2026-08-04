import { useState } from "react";

import { AccidentTable } from "./components/AccidentTable";
import { AccidentMap } from "./components/AccidentMap";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardIndicators } from "./components/DashboardIndicators";
import { FilterPanel } from "./components/FilterPanel";
import { useAcidentes } from "./hooks/useAcidentes";
import { useDashboardResumo } from "./hooks/useDashboardResumo";
import type { FiltrosAcidente } from "./types/acidente";

export function App() {
  const [filtros, setFiltros] = useState<FiltrosAcidente>({});
  const { acidentes, total, carregando, erro } = useAcidentes(filtros);
  const resumo = useDashboardResumo(filtros);

  return (
    <div className="app-shell">
      <DashboardHeader />

      <main className="dashboard">
        <FilterPanel onAplicar={setFiltros} />

        <DashboardIndicators {...resumo} />

        <section className="dashboard-grid">
          <AccidentMap acidentes={acidentes} />
          <AccidentTable
            acidentes={acidentes}
            total={total}
            carregando={carregando}
            erro={erro}
          />
        </section>
      </main>

      <footer className="app-footer">Painel de Acidentes</footer>
    </div>
  );
}
