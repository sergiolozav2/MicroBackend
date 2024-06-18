import { Static, Type } from "@sinclair/typebox";
import { SelectUserSafeSchema, UpdateUserSchema } from "../user/user.schema";

// ESQUEMAS ÚTILES
const InsertUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  nombre: Type.String(),
  password: Type.String(),
});

// ESQUEMA PARA REGISTRAR ADMINISTRADOR DE LÍNEA
export type PostAdministradorLineaType = Static<
  typeof PostAdministradorLineaSchemaBody
>;

const PostAdministradorLineaSchemaBody = Type.Object({
  lineaTransporteID: Type.Integer(),
  usuario: InsertUserSchema,
});

export const PostAdministradorLineaSchema = {
  body: PostAdministradorLineaSchemaBody,
  response: { 200: SelectUserSafeSchema },
};

// ESQUEMA PARA EDITAR ADMINISTRADOR DE LÍNEA
export type PutAdministradorLineaType = Static<
  typeof PutAdministradorLineaSchemaBody
>;

const PutAdministradorLineaSchemaBody = Type.Object({
  lineaTransporteID: Type.Integer(),
  usuario: UpdateUserSchema,
});

export const PutAdministradorLineaSchema = {
  body: PutAdministradorLineaSchemaBody,
  response: { 200: Type.Object({ result: Type.Boolean() }) },
};

// ESQUEMA DE OBTENER TODAS LAS LÍNEAS DE TRANSPORTE - TABLA
export const GetAllAdministradoresSchema = {
  response: {
    200: Type.Object({
      list: Type.Array(SelectUserSafeSchema),
    }),
  },
};

// ESQUEMA DE OBTENER UNA LÍNEA DE TRANSPORTE

const GetLineaTransporteSchemaParams = Type.Object({
  lineaTransporteID: Type.Integer(),
});
export const GetLineaTransporteSchema = {
  params: GetLineaTransporteSchemaParams,
};
