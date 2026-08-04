import { useEffect, useState } from "react";

import { acidenteService } from "../services/acidenteService";
import type { AcidenteMapa, FiltrosAcidente } from "../types/acidente";

export function useAcidentesMapa(
  filtros: FiltrosAcidente = {},
): AcidenteMapa[] {
  const [acidentes, setAcidentes] = useState<AcidenteMapa[]>([]);

  useEffect(() => {
    let ativo = true;

    async function carregarAcidentes() {
      try {
        const resposta = await acidenteService.listarMapa(filtros);
        if (ativo) {
          setAcidentes(resposta);
        }
      } catch {
        // Estados específicos do mapa serão tratados em uma etapa futura.
      }
    }

    void carregarAcidentes();

    return () => {
      ativo = false;
    };
  }, [filtros]);

  return acidentes;
}
