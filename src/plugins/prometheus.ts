import { FastifyInstance } from "fastify";
import metricsPlugin from "fastify-metrics";
import fastifyPlugin from "fastify-plugin";
import client from "prom-client";

async function plugin(fastify: FastifyInstance) {
  const register = new client.Registry();

  register.setDefaultLabels({ app: "fastify" });
  client.collectDefaultMetrics({ register });

  const counter = new client.Counter({
    name: "http_requests",
    help: "Cantidad peticiones llamadas para Prometheus",
    labelNames: ["method", "route", "statusCode"],
  });
  register.registerMetric(counter);

  fastify.addHook("preHandler", (req,_, done) => {
    counter
      .labels({
        method: req.method,
        route: req.originalUrl,
        statusCode: 200,
      })
      .inc(1);
    done();
  });
  await fastify.register(metricsPlugin, {
    endpoint: "/metrics",
  });
}

export default fastifyPlugin(plugin, { dependencies: ["config"] });
