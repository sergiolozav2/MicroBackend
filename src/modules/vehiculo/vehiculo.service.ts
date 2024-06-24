import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import { PostVehiculoType, PutVehiculoTiempoRealBody } from "./vehiculo.schema";
import { eq, gt, lt } from "drizzle-orm";

export class VehiculoService extends SharedRepository {
  async crear(data: PostVehiculoType) {
    console.log(data);
    await this.db.insert(schema.vehiculo).values(data);
    return true;
  }

  async all() {
    const results = await this.db.query.vehiculo.findMany({
      columns: {
        vehiculoID: true,
        modelo: true,
        propietarioNombre: true,
        aireAcondicionado: true,
        creadoEn: true,
        lineaTransporteID: true,
        matricula: true,
      },
      with: {
        lineaTransporte: {
          columns: {
            numeroLinea: true,
          },
        },
      },
    });
    return results;
  }

  async tiempoReal() {
    // Resta 2 segundos
    const pasado = new Date(Date.now() - 5 * 1000).toISOString();

    const vehiculos = await this.db.query.vehiculo.findMany({
      columns: {
        vehiculoID: true,
        latitud: true,
        matricula: true,
        modelo: true,
        lineaTransporteID: true,
        longitud: true,
      },
      with: {
        lineaTransporte: {
          columns: {
            numeroLinea: true,
          },
        },
      },
      where: gt(schema.vehiculo.ultimoViaje, pasado),
    });
    return vehiculos;
  }

  async actualizarPosicionViaje(data: PutVehiculoTiempoRealBody) {
    const date = new Date();
    await this.db
      .update(schema.vehiculo)
      .set({ ...data, ultimoViaje: date.toISOString() })
      .where(eq(schema.vehiculo.vehiculoID, data.vehiculoID));
    return true;
  }
}
