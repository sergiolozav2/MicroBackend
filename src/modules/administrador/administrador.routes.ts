import { FastifyTypebox } from "@api/types/FastifyTypebox";
import {
  PostAdministradorLineaSchema,
  PutAdministradorLineaSchema,
} from "./administrador.schema";
import { AdministradorService } from "./administrador.service";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const administrador = new AdministradorService();
  fastify.post(
    "/",
    {
      schema: PostAdministradorLineaSchema,
    },
    async (req, reply) => {
      const result = await administrador.crear(req.body);
      reply.send(result);
    }
  );

  fastify.put(
    "/",
    {
      schema: PutAdministradorLineaSchema,
    },
    async (req, reply) => {
      const result = await administrador.editar(req.body);
      reply.send({ result });
    }
  );

  done();
}
