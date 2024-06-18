import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import { GetRutaCalculadaType, RutaResponseType } from "./mapa.schema";
import { asc } from "drizzle-orm";

type PuntoType = {
  latitud: number;
  longitud: number;
};

type PuntoRutaType = {
  latitud: number;
  longitud: number;
  rutaID: number;
};
export class MapaService extends SharedRepository {
  private calcularDistancia(a: PuntoType, b: PuntoType) {
    const toRad = (x: number): number => (x * Math.PI) / 180;

    const dLat = toRad(b.latitud - a.latitud);
    const dLon = toRad(b.longitud - a.longitud);
    const lat1 = toRad(a.latitud);
    const lat2 = toRad(b.latitud);

    const value =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));

    const R = 6371; // Earth radius in kilometers
    return R * c;
  }

  private puntoMasCercano(punto: PuntoType, ruta: PuntoRutaType[]) {
    let minDistancia = 999999;
    let puntoMinimo: PuntoRutaType;
    for (const parada of ruta) {
      const distancia = this.calcularDistancia(punto, parada);
      if (distancia < minDistancia) {
        minDistancia = distancia;
        puntoMinimo = parada;
      }
    }
    return puntoMinimo;
  }
  async calcularRuta(data: GetRutaCalculadaType) {
    const lineas = await this.db.query.lineaTransporte.findMany({
      with: {
        rutaIda: {
          with: {
            puntos: {
              orderBy: asc(schema.puntoRuta.puntoRutaID),
            },
          },
        },
      },
    });
    const rutas = lineas.map((linea) => ({
      ...linea.rutaIda,
      lineaTransporteID: linea.lineaTransporteID,
      numeroLinea: linea.numeroLinea,
    }));

    let minDistancia = 999999;
    let minRuta: RutaResponseType | undefined;

    for (const ruta of rutas) {
      const inicio = this.puntoMasCercano(data.inicio, ruta.puntos);
      const final = this.puntoMasCercano(data.destino, ruta.puntos);

      const distanciaInicio = this.calcularDistancia(data.inicio, inicio);
      const distanciaFinal = this.calcularDistancia(data.destino, final);
      const distancia = distanciaInicio + distanciaFinal;
      if (distancia < minDistancia) {
        minDistancia = distancia;
        minRuta = ruta;
      }
    }

    return [minRuta];
  }
}
