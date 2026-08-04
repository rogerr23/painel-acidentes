import type { Acidente } from "../types/acidente";

interface AccidentTableProps {
  acidentes: Acidente[];
  total: number;
  carregando: boolean;
  erro: string | null;
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function formatarHora(hora: string): string {
  return hora.slice(0, 5);
}

export function AccidentTable({
  acidentes,
  total,
  carregando,
  erro,
}: AccidentTableProps) {
  return (
    <section className="panel list-panel" aria-labelledby="list-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Registros recentes</p>
          <h2 id="list-title">Acidentes</h2>
        </div>
        {!carregando && !erro && (
          <span className="result-count">
            {total} {total === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>

      {carregando && (
        <div className="list-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <strong>Carregando acidentes...</strong>
          <p>Aguarde enquanto consultamos os registros.</p>
        </div>
      )}

      {!carregando && erro && (
        <div className="list-state list-state--error" role="alert">
          <strong>Não foi possível carregar a listagem</strong>
          <p>{erro}</p>
        </div>
      )}

      {!carregando && !erro && acidentes.length === 0 && (
        <div className="list-state" role="status">
          <strong>Nenhum acidente encontrado</strong>
          <p>Não existem registros disponíveis para exibição.</p>
        </div>
      )}

      {!carregando && !erro && acidentes.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data e hora</th>
                <th>Ocorrência</th>
                <th>Local</th>
                <th>Gravidade</th>
              </tr>
            </thead>
            <tbody>
              {acidentes.map((acidente) => (
                <tr key={acidente.id}>
                  <td>
                    <strong>{formatarData(acidente.data)}</strong>
                    <span>{formatarHora(acidente.hora)}</span>
                  </td>
                  <td>{acidente.tipo}</td>
                  <td>
                    <strong>{acidente.bairro}</strong>
                    <span>{acidente.logradouro}</span>
                  </td>
                  <td>
                    <span
                      className={`severity severity--${acidente.gravidade.toLowerCase()}`}
                    >
                      {acidente.gravidade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
