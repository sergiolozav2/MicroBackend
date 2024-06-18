import { Static, Type } from "@sinclair/typebox";

// ESQUEMAS ÚTILES RELACIONADOS A USUARIO
export type SelectUserType = Static<typeof InsertUserSchema>;
export type InsertUserType = Static<typeof InsertUserSchema>;

export const SelectUserSchema = Type.Object({
  usuarioID: Type.Number(),
  email: Type.String({ format: "email" }),
  nombre: Type.String(),
  password: Type.String(),
});
export const SelectUserSafeSchema = Type.Omit(SelectUserSchema, ["password"]);

export const InsertUserSchema = Type.Omit(SelectUserSchema, ["usuarioID"]);
export const UpdateUserSchema = Type.Partial(InsertUserSchema);
