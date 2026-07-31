import type { Indicador } from "../types/acidente";

export function IndicatorCard({
  label,
  valor,
  descricao,
  destaque = false,
}: Indicador) {
  return (
    <article
      className={`indicator-card${destaque ? " indicator-card--featured" : ""}`}
    >
      <p>{label}</p>
      <strong>{valor}</strong>
      <span>{descricao}</span>
    </article>
  );
}
