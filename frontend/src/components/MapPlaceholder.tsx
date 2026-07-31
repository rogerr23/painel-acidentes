export function MapPlaceholder() {
  return (
    <section className="panel map-panel" aria-labelledby="map-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Distribuição geográfica</p>
          <h2 id="map-title">Mapa de acidentes</h2>
        </div>
        <span className="status-pill">Visualização inicial</span>
      </div>

      <div className="map-placeholder">
        <div className="map-pin" aria-hidden="true">
          <span />
        </div>
        <strong>Área reservada para o mapa</strong>
        <p>O mapa interativo será adicionado na próxima etapa.</p>
      </div>
    </section>
  );
}
