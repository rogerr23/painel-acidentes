import type {
  AcidenteMapa,
  AcidentesPaginados,
  BairroResumo,
  ConsultaAcidentes,
  DashboardResumo,
  FiltrosAcidente,
} from "../types/acidente";
import { apiGet } from "./api";

function criarParametros(
  filtros: FiltrosAcidente | ConsultaAcidentes = {},
): URLSearchParams {
  const parametros = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== "") {
      parametros.set(chave, String(valor));
    }
  });

  return parametros;
}

export const acidenteService = {
  listar(
    consulta: ConsultaAcidentes = {},
  ): Promise<AcidentesPaginados> {
    return apiGet<AcidentesPaginados>(
      "/acidentes",
      criarParametros(consulta),
    );
  },

  listarMapa(filtros: FiltrosAcidente = {}): Promise<AcidenteMapa[]> {
    return apiGet<AcidenteMapa[]>(
      "/acidentes/mapa",
      criarParametros(filtros),
    );
  },

  obterResumo(filtros: FiltrosAcidente = {}): Promise<DashboardResumo> {
    return apiGet<DashboardResumo>(
      "/dashboard/resumo",
      criarParametros(filtros),
    );
  },

  listarPorBairro(filtros: FiltrosAcidente = {}): Promise<BairroResumo[]> {
    return apiGet<BairroResumo[]>(
      "/dashboard/bairros",
      criarParametros(filtros),
    );
  },
};
