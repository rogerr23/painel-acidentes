import { useEffect, useMemo } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import type { Acidente } from "../types/acidente";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

interface AccidentMapProps {
  acidentes: Acidente[];
}

interface AcidenteMapeado {
  acidente: Acidente;
  posicao: [number, number];
}

const CENTRO_RIO_DE_JANEIRO: [number, number] = [-22.9068, -43.1729];

function converterCoordenada(
  valor: string | number | null | undefined,
): number | null {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return null;
  }

  const coordenada = Number(valor);
  return Number.isFinite(coordenada) ? coordenada : null;
}

function mapearAcidente(acidente: Acidente): AcidenteMapeado | null {
  const latitude = converterCoordenada(acidente.latitude);
  const longitude = converterCoordenada(acidente.longitude);

  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    acidente,
    posicao: [latitude, longitude],
  };
}

function AjustarVisualizacao({ acidentes }: { acidentes: AcidenteMapeado[] }) {
  const mapa = useMap();

  useEffect(() => {
    if (acidentes.length === 1) {
      mapa.setView(acidentes[0].posicao, 15);
      return;
    }

    if (acidentes.length > 1) {
      mapa.fitBounds(
        acidentes.map(({ posicao }) => posicao),
        { padding: [32, 32], maxZoom: 15 },
      );
    }
  }, [acidentes, mapa]);

  return null;
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function formatarHora(hora: string): string {
  return hora.slice(0, 5);
}

export function AccidentMap({ acidentes }: AccidentMapProps) {
  const acidentesMapeados = useMemo(
    () => acidentes.map(mapearAcidente).filter((item) => item !== null),
    [acidentes],
  );
  const registrosIgnorados = acidentes.length - acidentesMapeados.length;

  return (
    <section className="panel map-panel" aria-labelledby="map-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Distribuição geográfica</p>
          <h2 id="map-title">Mapa de acidentes</h2>
        </div>
        <span className="status-pill">
          {acidentesMapeados.length} no mapa
        </span>
      </div>

      <MapContainer
        center={CENTRO_RIO_DE_JANEIRO}
        zoom={11}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AjustarVisualizacao acidentes={acidentesMapeados} />

        {acidentesMapeados.map(({ acidente, posicao }) => (
          <Marker key={acidente.id} position={posicao}>
            <Popup>
              <div className="map-popup">
                <strong>{acidente.tipo}</strong>
                <dl>
                  <div>
                    <dt>Gravidade</dt>
                    <dd>{acidente.gravidade}</dd>
                  </div>
                  <div>
                    <dt>Bairro</dt>
                    <dd>{acidente.bairro}</dd>
                  </div>
                  <div>
                    <dt>Data</dt>
                    <dd>{formatarData(acidente.data)}</dd>
                  </div>
                  <div>
                    <dt>Hora</dt>
                    <dd>{formatarHora(acidente.hora)}</dd>
                  </div>
                </dl>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {registrosIgnorados > 0 && (
        <p className="map-warning" role="status">
          {registrosIgnorados}{" "}
          {registrosIgnorados === 1
            ? "registro foi ignorado"
            : "registros foram ignorados"}{" "}
          por não possuir coordenadas válidas.
        </p>
      )}
    </section>
  );
}
