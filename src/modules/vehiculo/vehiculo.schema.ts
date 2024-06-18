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
