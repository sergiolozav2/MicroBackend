import { Static, Type } from "@sinclair/typebox";
import { InsertUserSchema } from "../user/user.schema";
import { AuthTokenSchema } from "../shared/shared.schema";

// ESQUEMAS ÚTILES RELACIONADOS A CONDUCTOR

// ESQUEMA DE CREAR CONDUCTOR
export type PostConductorBody = Static<typeof PostConductorBody>;

const PostConductorBody = Type.Object({
  usuario: InsertUserSchema,
  vehiculosID: Type.Array(Type.Integer()),
});

export const PostConductorSchema = {
  body: PostConductorBody,
  response: {
    200: Type.Object({
      result: Type.Boolean(),
    }),
  },
};

// ESQUEMA DE OBTENER CONDUCTORES
const GetConductoresSchemaResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      usuarioID: Type.Number(),
      email: Type.String(),
      nombre: Type.String(),
      permisos: Type.String(),
      verificado: Type.Boolean(),
      creadoEn: Type.String(),
      vehiculos: Type.Array(
        Type.Object({
          creadoEn: Type.String(),
          vehiculo: Type.Object({
            lineaTransporteID: Type.Number(),
            vehiculoID: Type.Number(),
            matricula: Type.String(),
            modelo: Type.String(),
            aireAcondicionado: Type.Boolean(),
            propietarioNombre: Type.String(),
          }),
        })
      ),
    })
  ),
});

export const GetConductoresSchema = {
  response: {
    200: GetConductoresSchemaResponse,
  },
};

// VEHICULO DE CONDUCTOR
const GetVehiculosConductorSchemaResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      usuarioID: Type.Number(),
      creadoEn: Type.String(),
      vehiculoID: Type.Number(),
      vehiculo: Type.Object({
        creadoEn: Type.String(),
        lineaTransporte: Type.Object({
          numeroLinea: Type.String(),
        }),
        lineaTransporteID: Type.Number(),
        vehiculoID: Type.Number(),
        matricula: Type.String(),
        modelo: Type.String(),
        aireAcondicionado: Type.Boolean(),
        propietarioNombre: Type.String(),
      }),
    })
  ),
});

export const GetVehiculosConductorSchema = {
  headers: AuthTokenSchema,
  response: {
    200: GetVehiculosConductorSchemaResponse,
  },
};
