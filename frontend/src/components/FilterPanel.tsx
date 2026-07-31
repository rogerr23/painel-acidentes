export function FilterPanel() {
  return (
    <section className="panel filter-panel" aria-labelledby="filter-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Consulta</p>
          <h2 id="filter-title">Filtros</h2>
        </div>
        <button className="button button--ghost" type="button">
          Limpar filtros
        </button>
      </div>

      <form className="filter-grid">
        <label className="field">
          <span>Bairro</span>
          <select defaultValue="">
            <option value="">Todos os bairros</option>
            <option>Centro</option>
            <option>Copacabana</option>
            <option>Tijuca</option>
          </select>
        </label>

        <label className="field">
          <span>Tipo</span>
          <select defaultValue="">
            <option value="">Todos os tipos</option>
            <option>Colisão</option>
            <option>Atropelamento</option>
            <option>Queda de moto</option>
          </select>
        </label>

        <label className="field">
          <span>Gravidade</span>
          <select defaultValue="">
            <option value="">Todas as gravidades</option>
            <option>Leve</option>
            <option>Moderado</option>
            <option>Grave</option>
          </select>
        </label>

        <label className="field">
          <span>Data inicial</span>
          <input type="date" />
        </label>

        <label className="field">
          <span>Data final</span>
          <input type="date" />
        </label>

        <button className="button button--primary" type="button">
          Aplicar filtros
        </button>
      </form>
    </section>
  );
}
