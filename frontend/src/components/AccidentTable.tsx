import type { Acidente } from "../types/acidente";

interface AccidentTableProps {
  acidentes: Acidente[];
}

export function AccidentTable({ acidentes }: AccidentTableProps) {
  return (
    <section className="panel list-panel" aria-labelledby="list-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Registros recentes</p>
          <h2 id="list-title">Acidentes</h2>
        </div>
        <span className="result-count">{acidentes.length} registros</span>
      </div>

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
                  <strong>{acidente.data}</strong>
                  <span>{acidente.hora}</span>
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
    </section>
  );
}
