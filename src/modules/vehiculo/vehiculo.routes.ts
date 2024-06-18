import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { VehiculoService } from "./vehiculo.service";
import {
  GetVehiculoSchema as GetAllVehiculoSchema,
  PostVehiculoSchema,
} from "./vehiculo.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const vehiculoService = new VehiculoService();
  fastify.post(
    "/",
    {
      schema: PostVehiculoSchema,
    },
    async (req, reply) => {
      const result = await vehiculoService.crear(req.body);
      reply.send({ result });
    }
  );

  fastify.get(
    "/",
    {
      schema: GetAllVehiculoSchema,
    },
    async (_, reply) => {
      const list = await vehiculoService.all();
      reply.send({ list });
    }
  );
  done();
}
