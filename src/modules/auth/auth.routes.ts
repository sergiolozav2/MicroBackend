import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { LoginSchema, RegisterRequestSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { FastifyRequest } from "fastify";

export abstract class IAuthHandler {
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  authService: AuthService;
  register(req: FastifyRequest) {
    console.log(req)
  }
  login(req: FastifyRequest) {
    console.log(req)
  }
}

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const authService = new AuthService();

  fastify.post(
    "/register",
    {
      schema: RegisterRequestSchema,
    },
    async (req) => {
      const result = await authService.register(req.body);
      return result;
    }
  );

  fastify.post(
    "/login",
    {
      schema: LoginSchema,
    },
    async (req, reply) => {
      const { usuario } = await authService.login(req.body);
      const token = fastify.jwt.createAccessToken({
        usuarioID: usuario.usuarioID,
      });
      reply.send({ usuario, token });
    }
  );

  done();
}
