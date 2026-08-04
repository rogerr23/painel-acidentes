import { useEffect, useState } from "react";

import { acidenteService } from "../services/acidenteService";
import type { DashboardResumo, FiltrosAcidente } from "../types/acidente";

interface UseDashboardResumoResult {
  resumo: DashboardResumo | null;
  carregando: boolean;
  erro: string | null;
}

export function useDashboardResumo(
  filtros: FiltrosAcidente,
): UseDashboardResumoResult {
  const [resumo, setResumo] = useState<DashboardResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro(null);
    setResumo(null);

    async function carregarResumo() {
      try {
        const resposta = await acidenteService.obterResumo(filtros);

        if (ativo) {
          setResumo(resposta);
        }
      } catch (error) {
        if (ativo) {
          const mensagem =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os indicadores.";
          setErro(mensagem);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarResumo();

    return () => {
      ativo = false;
    };
  }, [filtros]);

  return { resumo, carregando, erro };
}
