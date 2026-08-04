export const TEXTO_NAO_INFORMADO = "Não informado";

export function formatarData(valor: string | null | undefined): string {
  const partes = valor?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!partes) {
    return TEXTO_NAO_INFORMADO;
  }

  const [, ano, mes, dia] = partes;
  const anoNumero = Number(ano);
  const mesNumero = Number(mes);
  const diaNumero = Number(dia);
  const ultimoDiaDoMes = new Date(Date.UTC(anoNumero, mesNumero, 0)).getUTCDate();

  if (
    anoNumero < 1 ||
    mesNumero < 1 ||
    mesNumero > 12 ||
    diaNumero < 1 ||
    diaNumero > ultimoDiaDoMes
  ) {
    return TEXTO_NAO_INFORMADO;
  }

  return `${dia}/${mes}/${ano}`;
}

export function formatarHora(valor: string | null | undefined): string {
  const hora = valor?.trim();
  if (!hora || !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(hora)) {
    return TEXTO_NAO_INFORMADO;
  }

  return hora.slice(0, 5);
}
