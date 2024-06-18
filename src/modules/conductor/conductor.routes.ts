import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { ConductorService } from "./conductor.service";
import {
  GetConductoresSchema,
  GetVehiculosConductorSchema,
  PostConductorSchema,
} from "./conductor.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const conductorService = new ConductorService();

  fastify.get(
    "/",
    {
      schema: GetConductoresSchema,
    },
    async (_, reply) => {
      const list = await conductorService.all();
      reply.send({ list });
    }
  );

  fastify.post(
    "/",
    {
      schema: PostConductorSchema,
    },
    async (req, reply) => {
      const result = await conductorService.create(req.body);
      reply.send({ result });
    }
  );

  fastify.get(
    "/vehiculos",
    {
      preHandler: fastify.authenticate,
      schema: GetVehiculosConductorSchema,
    },
    async (req, reply) => {
      const list = await conductorService.vehiculos(req.user.usuarioID);
      reply.send({ list });
    }
  );

  done();
}
