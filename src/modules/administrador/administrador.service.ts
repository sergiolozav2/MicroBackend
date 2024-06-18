import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import {
  PostAdministradorLineaType,
  PutAdministradorLineaType,
} from "./administrador.schema";
import { eq } from "drizzle-orm";
import { AuthService } from "../auth/auth.service";

export class AdministradorService extends SharedRepository {
  constructor() {
    super();
    this.authService = new AuthService();
  }


  async editar(data: PutAdministradorLineaType) {
    const { password } = data.usuario;
    if (password) {
      data.usuario.password = await this.authService.hashPassword(
        data.usuario.password
      );
    }
    const { administradorID, numeroLinea } =
      await this.db.query.lineaTransporte.findFirst({
        where: eq(
          schema.lineaTransporte.lineaTransporteID,
          data.lineaTransporteID
        ),
        columns: {
          administradorID: true,
          numeroLinea: true,
        },
      });

    if (!administradorID) {
      throw new Error(
        `La línea ${numeroLinea} no tiene administrador, crea uno para editarlo`
      );
    }

    await this.db
      .update(schema.usuario)
      .set(data.usuario)
      .where(eq(schema.usuario.usuarioID, administradorID));
    return true;
  }
  
  private authService: AuthService;

  async crear(data: PostAdministradorLineaType) {
    const usuario = await this.db.transaction(async (tx) => {
      await this.authService.registerSetup(data.usuario);
      const [usuario] = await tx
        .insert(schema.usuario)
        .values({ ...data.usuario, permisos: "010" })
        .returning();

      await tx
        .update(schema.lineaTransporte)
        .set({
          administradorID: usuario.usuarioID,
        })
        .where(
          eq(schema.lineaTransporte.lineaTransporteID, data.lineaTransporteID)
        );
      return usuario;
    });
    return usuario;
  }

  async all() {
    const results = await this.db.query.lineaTransporte.findMany({
      with: {
        administrador: {
          columns: {
            nombre: true,
            usuarioID: true,
          },
        },
        vehiculos: true,
      },
    });
    return results;
  }

  async uno(lineaTransporteID: number) {
    const result = await this.db.query.lineaTransporte.findFirst({
      with: {
        administrador: {
          columns: {
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
}
