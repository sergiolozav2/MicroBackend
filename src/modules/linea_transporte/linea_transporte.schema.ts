import { Static, Type } from "@sinclair/typebox";
import { SelectVehiculoSchema } from "../vehiculo/vehiculo.schema";

// ESQUEMAS ÚTILES RELACIONADOS A LINEAS DE TRANSPORTE
export type SelectUserType = Static<typeof InsertUserSchema>;
export type InsertUserType = Static<typeof InsertUserSchema>;
export type InsertPuntoRutaType = Static<typeof InsertPuntoRutaSchema>;

const SelectRutaSchema = Type.Object({
  rutaID: Type.Number(),
  puntos: Type.Array(
    Type.Object({
      latitud: Type.Number(),
      longitud: Type.Number(),
    })
  ),
});

const SelectLineaTransporteSchema = Type.Object({
  lineaTransporteID: Type.Number(),
  numeroLinea: Type.String(),
  rutaIdaID: Type.Number(),
  rutaVueltaID: Type.Number(),
  creadoEn: Type.String(),
  administradorID: Type.Union([Type.Number(), Type.Null()]),
  administrador: Type.Object({
    usuarioID: Type.Integer(),
    nombre: Type.String(),
    email: Type.String(),
  }),
  vehiculos: Type.Array(SelectVehiculoSchema),
  rutaIda: SelectRutaSchema,
  rutaVuelta: SelectRutaSchema,
});

const InsertPuntoRutaSchema = Type.Object({
  latitud: Type.Number(),
  longitud: Type.Number(),
  rutaID: Type.Number(),
});

// ESQUEMA DE CREAR UNA LÍNEA DE TRANSPORTE
export type PostLineaTransporteType = Static<
  typeof PostLineaTransporteSchemaBody
>;

const PostLineaTransporteSchemaBody = Type.Object({
  numeroLinea: Type.String(),
  rutaIda: Type.Array(Type.Omit(InsertPuntoRutaSchema, ["rutaID"])),
  rutaVuelta: Type.Array(Type.Omit(InsertPuntoRutaSchema, ["rutaID"])),
});
const PostLineaTransporteSchemaResult = Type.Object({
  result: Type.Boolean(),
});

export const PostLineaTransporteSchema = {
  body: PostLineaTransporteSchemaBody,
  response: { 200: PostLineaTransporteSchemaResult },
};

// ESQUEMA DE OBTENER TODAS LAS LÍNEAS DE TRANSPORTE - TABLA
export const GetAllLineaTransporteSchema = {
  response: {
    200: Type.Object({
      list: Type.Array(Type.Omit(SelectLineaTransporteSchema, ["rutaVuelta"])),
    }),
  },
};

// ESQUEMA DE OBTENER TODAS LAS LÍNEAS DE TRANSPORTE [SOLO ID Y NÚMERO]
export const GetAllLineaTransporteSoloLineaSchema = {
  response: {
    200: Type.Object({
      list: Type.Array(
        Type.Object({
          lineaTransporteID: Type.Number(),
          numeroLinea: Type.String(),
        })
      ),
    }),
  },
};
// ESQUEMA DE OBTENER UNA LÍNEA DE TRANSPORTE

const GetLineaTransporteSchemaParams = Type.Object({
  lineaTransporteID: Type.Integer(),
});
export const GetLineaTransporteSchema = {
  params: GetLineaTransporteSchemaParams,
  response: {
    200: SelectLineaTransporteSchema,
  },
};

// ESQUEMA DE EDITAR LÍNEA
export type PutLineaTransporteType = Static<
  typeof PutLineaTransporteSchemaBody
>;

const PutLineaTransporteSchemaBody = Type.Partial(
  PostLineaTransporteSchemaBody
);
const PutLineaTransporteSchemaResult = Type.Object({
  result: Type.Boolean(),
});

export const PutLineaTransporteSchema = {
  params: GetLineaTransporteSchemaParams,
  body: PutLineaTransporteSchemaBody,
  response: { 200: PutLineaTransporteSchemaResult },
};

export const SelectUserSchema = Type.Object({
  usuarioID: Type.Number(),
  email: Type.String({ format: "email" }),
  nombre: Type.String(),
  password: Type.String(),
});

export const InsertUserSchema = Type.Omit(SelectUserSchema, ["usuarioID"]);
export const UpdateUserSchema = Type.Omit(InsertUserSchema, [
  "email",
  "password",
]);
