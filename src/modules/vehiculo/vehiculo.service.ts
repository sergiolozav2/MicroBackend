import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import { PostVehiculoType } from "./vehiculo.schema";

export class VehiculoService extends SharedRepository {
  async crear(data: PostVehiculoType) {
    console.log(data)
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
    });
    return results;
  }
}
