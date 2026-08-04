import { useEffect, useState } from "react";

import { acidenteService } from "../services/acidenteService";
import type { Acidente, FiltrosAcidente } from "../types/acidente";

interface UseAcidentesResult {
  acidentes: Acidente[];
  total: number;
  carregando: boolean;
  erro: string | null;
}

export function useAcidentes(
  filtros: FiltrosAcidente = {},
): UseAcidentesResult {
  const [acidentes, setAcidentes] = useState<Acidente[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro(null);
    setAcidentes([]);
    setTotal(0);

    async function carregarAcidentes() {
      try {
        const resposta = await acidenteService.listar({
          ...filtros,
          pagina: 1,
        });

        if (ativo) {
          setAcidentes(resposta.items);
          setTotal(resposta.total);
        }
      } catch (error) {
        if (ativo) {
          const mensagem =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os acidentes.";
          setErro(mensagem);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarAcidentes();

    return () => {
      ativo = false;
    };
  }, [filtros]);

  return { acidentes, total, carregando, erro };
}
