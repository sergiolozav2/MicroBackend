import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { MapaService } from "./mapa.service";
import { GetRutaCalculadaSchema } from "./mapa.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const mapaService = new MapaService();

  fastify.post(
    "/",
    {
      schema: GetRutaCalculadaSchema,
    },
    async (req, reply) => {
      const list = await mapaService.calcularRuta(req.body);
      reply.send({ list });
    }
  );

  done();
}
