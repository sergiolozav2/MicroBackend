import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { VehiculoService } from "./vehiculo.service";
import {
  GetVehiculoSchema as GetAllVehiculoSchema,
  GetVehiculoTiempoRealSchema,
  PostVehiculoSchema,
  PutVehiculoTiempoRealSchema,
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

  fastify.put(
    "/actualizar-viaje",
    {
      schema: PutVehiculoTiempoRealSchema,
    },
    async (req, reply) => {
      const success = await vehiculoService.actualizarPosicionViaje(req.body);
      reply.send({ success });
    }
  );

  fastify.get(
    "/ubicacion-real",
    {
      schema: GetVehiculoTiempoRealSchema,
    },
    async (_, reply) => {
      const list = await vehiculoService.tiempoReal();
      reply.send({ list });
    }
  );
  done();
}
