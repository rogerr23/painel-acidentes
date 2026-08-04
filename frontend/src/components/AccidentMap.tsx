import { useEffect, useMemo } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import type { AcidenteMapa } from "../types/acidente";
import { obterEstadoVisualMapa } from "../hooks/estadoConsultaMapa";
import { validarCoordenadas } from "../utils/coordinates";
import { formatarData, formatarHora } from "../utils/formatters";
import { obterClasseGravidade } from "../utils/severity";

const ICONE_ACIDENTE = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface AccidentMapProps {
  acidentes: AcidenteMapa[];
  carregando: boolean;
  erro: string | null;
}

interface AcidenteMapeado {
  acidente: AcidenteMapa;
  posicao: [number, number];
}

const CENTRO_RIO_DE_JANEIRO: [number, number] = [-22.9068, -43.1729];

function mapearAcidente(acidente: AcidenteMapa): AcidenteMapeado | null {
  const posicao = validarCoordenadas(acidente.latitude, acidente.longitude);
  if (!posicao) {
    return null;
  }

  return {
    acidente,
    posicao,
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

export function AccidentMap({
  acidentes,
  carregando,
  erro,
}: AccidentMapProps) {
  const acidentesMapeados = useMemo(
    () => acidentes.map(mapearAcidente).filter((item) => item !== null),
    [acidentes],
  );
  const registrosIgnorados = acidentes.length - acidentesMapeados.length;
  const estadoVisual = obterEstadoVisualMapa(
    carregando,
    erro,
    acidentes.length,
  );

  return (
    <section className="panel map-panel" aria-labelledby="map-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Distribuição geográfica</p>
          <h2 id="map-title">Mapa de acidentes</h2>
        </div>
        {estadoVisual === "dados" && (
          <span className="status-pill">
            {acidentesMapeados.length} no mapa
          </span>
        )}
      </div>

      {estadoVisual === "carregando" ? (
        <div className="list-state map-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <strong>Carregando acidentes no mapa...</strong>
          <p>Aguarde enquanto consultamos os registros.</p>
        </div>
      ) : estadoVisual === "erro" ? (
        <div className="list-state list-state--error map-state" role="alert">
          <strong>Não foi possível carregar os acidentes no mapa.</strong>
          <p>{erro}</p>
        </div>
      ) : estadoVisual === "vazio" ? (
        <div className="list-state map-state" role="status">
          <strong>Nenhum acidente encontrado</strong>
          <p>Nenhum acidente encontrado para os filtros selecionados.</p>
        </div>
      ) : (
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
            <Marker
              key={acidente.id}
              position={posicao}
              icon={ICONE_ACIDENTE}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{acidente.tipo}</strong>
                  <dl>
                    <div>
                      <dt>Gravidade</dt>
                      <dd>
                        <span
                          className={`severity ${obterClasseGravidade(acidente.gravidade)}`}
                        >
                          {acidente.gravidade}
                        </span>
                      </dd>
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
      )}

      {estadoVisual === "dados" && registrosIgnorados > 0 && (
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
