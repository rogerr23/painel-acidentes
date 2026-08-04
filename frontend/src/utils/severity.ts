const CLASSES_GRAVIDADE = {
  leve: "severity--light",
  moderado: "severity--moderate",
  grave: "severity--severe",
  fatal: "severity--fatal",
} as const;

export type GravidadeConhecida = keyof typeof CLASSES_GRAVIDADE;

export function normalizarGravidade(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function obterClasseGravidade(valor: string): string {
  const gravidade = normalizarGravidade(valor) as GravidadeConhecida;
  return CLASSES_GRAVIDADE[gravidade] ?? "severity--unknown";
}
