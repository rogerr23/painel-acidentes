import { useState, type FormEvent } from "react";

import type { FiltrosAcidente } from "../types/acidente";

interface FilterPanelProps {
  onAplicar: (filtros: FiltrosAcidente) => void;
}

interface FiltrosFormulario {
  bairro: string;
  tipo: string;
  gravidade: string;
  data_inicio: string;
  data_fim: string;
}

const FILTROS_VAZIOS: FiltrosFormulario = {
  bairro: "",
  tipo: "",
  gravidade: "",
  data_inicio: "",
  data_fim: "",
};

export function FilterPanel({ onAplicar }: FilterPanelProps) {
  const [filtros, setFiltros] = useState<FiltrosFormulario>(FILTROS_VAZIOS);

  function atualizarFiltro(campo: keyof FiltrosFormulario, valor: string) {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
  }

  function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAplicar({
      bairro: filtros.bairro.trim() || undefined,
      tipo: filtros.tipo.trim() || undefined,
      gravidade: filtros.gravidade.trim() || undefined,
      data_inicio: filtros.data_inicio || undefined,
      data_fim: filtros.data_fim || undefined,
    });
  }

  function limparFiltros() {
    setFiltros(FILTROS_VAZIOS);
    onAplicar({});
  }

  return (
    <section className="panel filter-panel" aria-labelledby="filter-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Consulta</p>
          <h2 id="filter-title">Filtros</h2>
        </div>
        <button
          className="button button--ghost"
          type="button"
          onClick={limparFiltros}
        >
          Limpar filtros
        </button>
      </div>

      <form className="filter-grid" onSubmit={aplicarFiltros}>
        <label className="field">
          <span>Bairro</span>
          <input
            type="text"
            value={filtros.bairro}
            placeholder="Todos os bairros"
            onChange={(event) => atualizarFiltro("bairro", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Tipo</span>
          <input
            type="text"
            value={filtros.tipo}
            placeholder="Todos os tipos"
            onChange={(event) => atualizarFiltro("tipo", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Gravidade</span>
          <input
            type="text"
            value={filtros.gravidade}
            placeholder="Todas as gravidades"
            onChange={(event) =>
              atualizarFiltro("gravidade", event.target.value)
            }
          />
        </label>

        <label className="field">
          <span>Data inicial</span>
          <input
            type="date"
            value={filtros.data_inicio}
            max={filtros.data_fim || undefined}
            onChange={(event) =>
              atualizarFiltro("data_inicio", event.target.value)
            }
          />
        </label>

        <label className="field">
          <span>Data final</span>
          <input
            type="date"
            value={filtros.data_fim}
            min={filtros.data_inicio || undefined}
            onChange={(event) =>
              atualizarFiltro("data_fim", event.target.value)
            }
          />
        </label>

        <button className="button button--primary" type="submit">
          Aplicar filtros
        </button>
      </form>
    </section>
  );
}
