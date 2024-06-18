import { Static, Type } from "@sinclair/typebox";
import { InsertUserSchema } from "../user/user.schema";

export type InsertUserType = Static<typeof InsertUserSchema>;
export type LoginRequestType = Static<typeof LoginRequestSchema>;

// ESQUEMA DE REGISTRAR USUARIO
export const RegisterRequestSchema = {
  body: InsertUserSchema,
};

// ESQUEMA DE LOGIN
export const LoginRequestSchema = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});

export const LoginRequestResponse = Type.Object({
  usuario: Type.Object({
    nombre: Type.String(),
  }),
  token: Type.String(),
});

export const LoginSchema = {
  body: LoginRequestSchema,
  response: {
    200: LoginRequestResponse,
  },
};
