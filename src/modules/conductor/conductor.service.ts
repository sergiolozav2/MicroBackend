import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import { PostConductorBody } from "./conductor.schema";
import { eq, like } from "drizzle-orm";
import { usuario } from "@api/db/schemas";
import { AuthService } from "../auth/auth.service";

export class ConductorService extends SharedRepository {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  private authService: AuthService;

  async all() {
    const results = await this.db.query.usuario.findMany({
      where: like(usuario.permisos, "__1"),
      columns: {
        password: false,
      },
      with: {
        vehiculos: {
          columns: {
            creadoEn: true,
          },
          with: {
            vehiculo: true,
          },
        },
      },
    });
    return results;
  }

  async create(data: PostConductorBody) {
    await this.db.transaction(async (tx) => {
      await this.authService.registerSetup(data.usuario);
      const [user] = await tx
        .insert(schema.usuario)
        .values({ ...data.usuario, permisos: "001" })
        .returning();
      const usuarioID = user.usuarioID;
      await tx.insert(schema.vehiculoConductor).values(
        data.vehiculosID.map((vehiculoID) => ({
          vehiculoID,
          usuarioID,
        }))
      );
    });
    return true;
  }

  async vehiculos(usuarioID: number) {
    const result = await this.db.query.usuario.findFirst({
      where: eq(schema.usuario.usuarioID, usuarioID),
      with: {
        vehiculos: {
          with: {
            vehiculo: {
              columns: {
                activo: false,
              },
              with: {
                lineaTransporte: {
                  columns: {
                    numeroLinea: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return result.vehiculos;
  }
}
