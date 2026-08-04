import { useEffect, useReducer } from "react";

import { acidenteService } from "../services/acidenteService";
import type { AcidenteMapa, FiltrosAcidente } from "../types/acidente";
import {
  estadoInicialConsultaMapa,
  obterMensagemErroMapa,
  reduzirEstadoConsultaMapa,
  type EstadoConsultaMapa,
} from "./estadoConsultaMapa";

export function useAcidentesMapa(
  filtros: FiltrosAcidente = {},
): EstadoConsultaMapa {
  const [estado, dispatch] = useReducer(
    reduzirEstadoConsultaMapa,
    estadoInicialConsultaMapa,
  );

  useEffect(() => {
    let ativo = true;
    dispatch({ tipo: "iniciar" });

    async function carregarAcidentes() {
      try {
        const resposta = await acidenteService.listarMapa(filtros);
        if (ativo) {
          dispatch({ tipo: "sucesso", acidentes: resposta });
        }
      } catch (error) {
        if (ativo) {
          dispatch({ tipo: "falha", erro: obterMensagemErroMapa(error) });
        }
      }
    }

    void carregarAcidentes();

    return () => {
      ativo = false;
    };
  }, [filtros]);

  return estado;
}
