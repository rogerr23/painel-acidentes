import type { DashboardResumo } from "../types/acidente";
import { IndicatorCard } from "./IndicatorCard";

interface DashboardIndicatorsProps {
  resumo: DashboardResumo | null;
  carregando: boolean;
  erro: string | null;
}

function normalizarGravidade(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function quantidadePorGravidade(
  resumo: DashboardResumo,
  gravidades: string[],
): number {
  return Object.entries(resumo.por_gravidade).reduce(
    (total, [gravidade, quantidade]) =>
      gravidades.includes(normalizarGravidade(gravidade))
        ? total + quantidade
        : total,
    0,
  );
}

export function DashboardIndicators({
  resumo,
  carregando,
  erro,
}: DashboardIndicatorsProps) {
  if (carregando) {
    return (
      <section
        className="indicator-grid"
        aria-label="Indicadores gerais"
        aria-busy="true"
      >
        {["total", "leves", "graves", "fatais"].map((indicador) => (
          <article className="indicator-card indicator-card--loading" key={indicador}>
            <span className="indicator-skeleton indicator-skeleton--label" />
            <span className="indicator-skeleton indicator-skeleton--value" />
            <span className="indicator-skeleton indicator-skeleton--description" />
          </article>
        ))}
        <span className="sr-only">Carregando indicadores...</span>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="indicator-grid" aria-label="Indicadores gerais">
        <div className="indicator-state indicator-state--error" role="alert">
          <strong>Não foi possível carregar os indicadores</strong>
          <p>{erro}</p>
        </div>
      </section>
    );
  }

  if (!resumo || resumo.total_acidentes === 0) {
    return (
      <section className="indicator-grid" aria-label="Indicadores gerais">
        <div className="indicator-state" role="status">
          <strong>Nenhum dado encontrado</strong>
          <p>Não existem indicadores para os filtros aplicados.</p>
        </div>
      </section>
    );
  }

  const indicadores = [
    {
      label: "Total de acidentes",
      valor: String(resumo.total_acidentes),
      descricao: "Registros encontrados",
      destaque: true,
    },
    {
      label: "Acidentes leves",
      valor: String(quantidadePorGravidade(resumo, ["leve", "leves"])),
      descricao: "Ocorrências classificadas",
    },
    {
      label: "Acidentes graves",
      valor: String(quantidadePorGravidade(resumo, ["grave", "graves"])),
      descricao: "Ocorrências classificadas",
    },
    {
      label: "Acidentes fatais",
      valor: String(quantidadePorGravidade(resumo, ["fatal", "fatais"])),
      descricao: "Ocorrências classificadas",
    },
  ];

  return (
    <section className="indicator-grid" aria-label="Indicadores gerais">
      {indicadores.map((indicador) => (
        <IndicatorCard key={indicador.label} {...indicador} />
      ))}
    </section>
  );
}
