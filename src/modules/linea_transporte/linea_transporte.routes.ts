import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { LineaTransporteService } from "./linea_transporte.service";
import {
  GetAllLineaTransporteSchema,
  GetAllLineaTransporteSoloLineaSchema,
  GetLineaTransporteSchema,
  PostLineaTransporteSchema,
  PutLineaTransporteSchema,
} from "./linea_transporte.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const lineaTransporte = new LineaTransporteService();
  fastify.post(
    "/",
    {
      schema: PostLineaTransporteSchema,
    },
    async (req, reply) => {
      const result = await lineaTransporte.crear(req.body);
      reply.send({ result });
    }
  );

  fastify.get(
    "/",
    {
      schema: GetAllLineaTransporteSchema,
    },
    async (_, reply) => {
      const list = await lineaTransporte.all();
      reply.send({ list });
    }
  );

  fastify.get(
    "/only-lines",
    {
      schema: GetAllLineaTransporteSoloLineaSchema,
    },
    async (_, reply) => {
      const list = await lineaTransporte.all();
      reply.send({ list });
    }
  );

  fastify.get(
    "/:lineaTransporteID",
    {
      schema: GetLineaTransporteSchema,
    },
    async (req, reply) => {
      const result = await lineaTransporte.uno(req.params.lineaTransporteID);
      reply.send(result);
    }
  );

  fastify.put(
    "/:lineaTransporteID",
    {
      schema: PutLineaTransporteSchema,
    },
    async (req, reply) => {
      const { lineaTransporteID } = req.params;
      const result = await lineaTransporte.editar(lineaTransporteID, req.body);
      reply.send({ result });
    }
  );
  done();
}
