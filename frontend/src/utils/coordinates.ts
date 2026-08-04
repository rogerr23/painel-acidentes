export type Coordenadas = [latitude: number, longitude: number];

export function validarCoordenadas(
  latitude: number,
  longitude: number,
): Coordenadas | null {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return [latitude, longitude];
}
