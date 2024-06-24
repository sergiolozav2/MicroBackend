import { Static, Type } from "@sinclair/typebox";

// ESQUEMAS ÚTILES RELACIONADOS A USUARIO

// ESQUEMA DE OBTENER TODOS LOS VEHÍCULOS - TABLA
export const SelectVehiculoSchema = Type.Object({
  vehiculoID: Type.Number(),
  matricula: Type.String(),
  modelo: Type.String(),
  aireAcondicionado: Type.Boolean(),
  creadoEn: Type.String(),
  propietarioNombre: Type.String(),
  lineaTransporteID: Type.Number(),
  lineaTransporte: Type.Object({
    numeroLinea: Type.String(),
  }),
});

export const GetVehiculoSchema = {
  response: {
    200: Type.Object({
      list: Type.Array(SelectVehiculoSchema),
    }),
  },
};

// ESQUEMA DE CREAR VEHÍCULO
const PostVehiculoSchemaBody = Type.Object({
  lineaTransporteID: Type.Number(),
  matricula: Type.String(),
  modelo: Type.String(),
  aireAcondicionado: Type.Boolean(),
  propietarioNombre: Type.String(),
});

export type PostVehiculoType = Static<typeof PostVehiculoSchemaBody>;

const PostVehiculoSchemaResult = Type.Object({
  result: Type.Boolean(),
});

export const PostVehiculoSchema = {
  body: PostVehiculoSchemaBody,
  response: { 200: PostVehiculoSchemaResult },
};

// ESQUEMA DE OBTENER VEHÍCULOS EN TIEMPO REAL
export const GetVehiculoTiempoRealResult = Type.Object({
  vehiculoID: Type.Number(),
  matricula: Type.String(),
  modelo: Type.String(),
  lineaTransporteID: Type.Number(),
  lineaTransporte: Type.Object({
    numeroLinea: Type.String(),
  }),
  latitud: Type.Optional(Type.Number()),
  longitud: Type.Optional(Type.Number()),
});

export const GetVehiculoTiempoRealSchema = {
  response: {
    200: Type.Object({
      list: Type.Array(GetVehiculoTiempoRealResult),
    }),
  },
};

// ESQUEMA DE ACTUALIZAR UBICACIÓN
const PutVehiculoTiempoRealResult = Type.Object({
  vehiculoID: Type.Number(),
  latitud: Type.Number(),
  longitud: Type.Number(),
});

export type PutVehiculoTiempoRealBody = Static<
  typeof PutVehiculoTiempoRealResult
>;

export const PutVehiculoTiempoRealSchema = {
  body: PutVehiculoTiempoRealResult,
  response: {
    200: Type.Object({ success: Type.Boolean() }),
  },
};
