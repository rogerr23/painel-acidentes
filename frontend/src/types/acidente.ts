export interface Acidente {
  id: number;
  data: string;
  hora: string;
  tipo: string;
  gravidade: string;
  bairro: string;
  logradouro: string;
  latitude?: string;
  longitude?: string;
}

export interface AcidenteMapa {
  id: number;
  data: string;
  hora: string;
  tipo: string;
  gravidade: string;
  bairro: string;
  latitude: string;
  longitude: string;
}

export interface FiltrosAcidente {
  bairro?: string;
  gravidade?: string;
  tipo?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface ConsultaAcidentes extends FiltrosAcidente {
  pagina?: number;
  por_pagina?: number;
}

export interface AcidentesPaginados {
  items: Acidente[];
  pagina: number;
  por_pagina: number;
  total: number;
  total_paginas: number;
}

export interface OpcoesFiltrosAcidente {
  bairros: string[];
  gravidades: string[];
  tipos: string[];
}

export interface DashboardResumo {
  total_acidentes: number;
  por_gravidade: Record<string, number>;
  por_tipo: Record<string, number>;
}

export interface BairroResumo {
  bairro: string;
  total: number;
}

export interface Indicador {
  label: string;
  valor: string;
  descricao: string;
  destaque?: boolean;
}
