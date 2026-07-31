export type Gravidade = "Leve" | "Moderado" | "Grave";

export interface Acidente {
  id: number;
  data: string;
  hora: string;
  tipo: string;
  gravidade: Gravidade;
  bairro: string;
  logradouro: string;
}

export interface Indicador {
  label: string;
  valor: string;
  descricao: string;
  destaque?: boolean;
}
