import type { AcidenteMapa } from "../types/acidente";

export interface EstadoConsultaMapa {
  acidentes: AcidenteMapa[];
  carregando: boolean;
  erro: string | null;
}

export type AcaoConsultaMapa =
  | { tipo: "iniciar" }
  | { tipo: "sucesso"; acidentes: AcidenteMapa[] }
  | { tipo: "falha"; erro: string };

export const estadoInicialConsultaMapa: EstadoConsultaMapa = {
  acidentes: [],
  carregando: true,
  erro: null,
};

export type EstadoVisualMapa = "carregando" | "erro" | "vazio" | "dados";

export function obterEstadoVisualMapa(
  carregando: boolean,
  erro: string | null,
  quantidadeAcidentes: number,
): EstadoVisualMapa {
  if (carregando) {
    return "carregando";
  }
  if (erro) {
    return "erro";
  }
  return quantidadeAcidentes === 0 ? "vazio" : "dados";
}

export function obterMensagemErroMapa(error: unknown): string {
  const mensagem = error instanceof Error ? error.message.trim() : "";

  return mensagem && mensagem !== "[object Object]"
    ? mensagem
    : "Não foi possível carregar os acidentes no mapa.";
}

export function reduzirEstadoConsultaMapa(
  estado: EstadoConsultaMapa,
  acao: AcaoConsultaMapa,
): EstadoConsultaMapa {
  switch (acao.tipo) {
    case "iniciar":
      return { acidentes: [], carregando: true, erro: null };
    case "sucesso":
      return { acidentes: acao.acidentes, carregando: false, erro: null };
    case "falha":
      return { acidentes: [], carregando: false, erro: acao.erro };
  }
}
