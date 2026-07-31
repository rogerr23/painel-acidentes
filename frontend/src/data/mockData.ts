import type { Acidente, Indicador } from "../types/acidente";

export const indicadoresSimulados: Indicador[] = [
  {
    label: "Total de acidentes",
    valor: "248",
    descricao: "No período selecionado",
    destaque: true,
  },
  {
    label: "Acidentes graves",
    valor: "31",
    descricao: "12,5% do total",
  },
  {
    label: "Tipo mais frequente",
    valor: "Colisão",
    descricao: "109 ocorrências",
  },
  {
    label: "Bairro com mais casos",
    valor: "Centro",
    descricao: "42 ocorrências",
  },
];

export const acidentesSimulados: Acidente[] = [
  {
    id: 1024,
    data: "30/07/2026",
    hora: "08:30",
    tipo: "Colisão",
    gravidade: "Leve",
    bairro: "Centro",
    logradouro: "Avenida Rio Branco",
  },
  {
    id: 1023,
    data: "29/07/2026",
    hora: "21:15",
    tipo: "Atropelamento",
    gravidade: "Grave",
    bairro: "Copacabana",
    logradouro: "Avenida Atlântica",
  },
  {
    id: 1022,
    data: "29/07/2026",
    hora: "17:40",
    tipo: "Queda de moto",
    gravidade: "Moderado",
    bairro: "Tijuca",
    logradouro: "Rua Conde de Bonfim",
  },
  {
    id: 1021,
    data: "28/07/2026",
    hora: "14:10",
    tipo: "Colisão",
    gravidade: "Leve",
    bairro: "Botafogo",
    logradouro: "Rua Voluntários da Pátria",
  },
];
