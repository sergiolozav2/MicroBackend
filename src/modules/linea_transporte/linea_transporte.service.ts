import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import {
  InsertPuntoRutaType,
  PostLineaTransporteType,
  PutLineaTransporteType,
} from "./linea_transporte.schema";
import { eq } from "drizzle-orm";

export class LineaTransporteService extends SharedRepository {
  async crear(data: PostLineaTransporteType) {
    await this.db.transaction(async (tx) => {
      const rutaIdaPromise = tx.insert(schema.ruta).values({}).returning();
      const rutaVueltaPromise = tx.insert(schema.ruta).values({}).returning();

      const rutas = await Promise.all([rutaIdaPromise, rutaVueltaPromise]);
      const [rutaIda] = rutas[0];
      const [rutaVuelta] = rutas[1];

      const puntos = [
        ...data.rutaIda.map((r) => ({ ...r, rutaID: rutaIda.rutaID })),
        ...data.rutaVuelta.map((r) => ({ ...r, rutaID: rutaVuelta.rutaID })),
      ];
      const puntosPromise = tx.insert(schema.puntoRuta).values(puntos);
      const lineaPromise = tx.insert(schema.lineaTransporte).values({
        numeroLinea: data.numeroLinea,
        rutaIdaID: rutaIda.rutaID,
        rutaVueltaID: rutaVuelta.rutaID,
      });
      const result = await Promise.allSettled([puntosPromise, lineaPromise]);
      const lineaCreada = result[1];
      if (lineaCreada.status === "rejected") {
        if (lineaCreada.reason?.code === "23505") {
          throw new Error("Ya existe ese número de línea");
        }
      }
    });
    return true;
  }

  async all() {
    const results = await this.db.query.lineaTransporte.findMany({
      with: {
        administrador: {
          columns: {
            nombre: true,
            email: true,
            usuarioID: true,
          },
        },
        vehiculos: true,
        rutaIda: {
          with: {
            puntos: true,
          },
        },
      },
    });
    return results;
  }

  async uno(lineaTransporteID: number) {
    const result = await this.db.query.lineaTransporte.findFirst({
      with: {
        administrador: {
          columns: {
            email: true,
            nombre: true,
            usuarioID: true,
          },
        },
        rutaIda: {
          with: {
            puntos: {
              columns: { latitud: true, longitud: true },
            },
          },
        },
        rutaVuelta: {
          with: {
            puntos: {
              columns: { latitud: true, longitud: true },
            },
          },
        },
        vehiculos: true,
      },
      where: eq(schema.lineaTransporte.lineaTransporteID, lineaTransporteID),
    });

    return result;
  }

  async editar(
    lineaTransporteID: number,
    lineaTransporte: PutLineaTransporteType
  ) {
    await this.db.transaction(async (tx) => {
      const { rutaIdaID, rutaVueltaID } =
        await tx.query.lineaTransporte.findFirst({
          where: eq(
            schema.lineaTransporte.lineaTransporteID,
            lineaTransporteID
          ),
          columns: {
            rutaIdaID: true,
            rutaVueltaID: true,
          },
        });

      const promises = [];
      const puntos: InsertPuntoRutaType[] = [];
      if (lineaTransporte.rutaIda) {
        const deleteIda = tx
          .delete(schema.puntoRuta)
          .where(eq(schema.puntoRuta.rutaID, rutaIdaID));
        puntos.push(
          ...lineaTransporte.rutaIda.map((p) => ({
            rutaID: rutaIdaID,
            ...p,
          }))
        );
        promises.push(deleteIda);
      }
      if (lineaTransporte.rutaVuelta) {
        const deleteVuelta = tx
          .delete(schema.puntoRuta)
          .where(eq(schema.puntoRuta.rutaID, rutaVueltaID));
        puntos.push(
          ...lineaTransporte.rutaVuelta.map((p) => ({
            rutaID: rutaVueltaID,
            ...p,
          }))
        );
        promises.push(deleteVuelta);
      }
      await Promise.all(promises);
      if (lineaTransporte.rutaIda || lineaTransporte.rutaVuelta) {
        if (puntos.length > 0) {
          await tx.insert(schema.puntoRuta).values(puntos);
        }
      }
    });
    return true;
  }
}
