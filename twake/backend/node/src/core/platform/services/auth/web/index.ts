import { FastifyInstance, FastifyRegisterOptions } from "fastify";
import routes from "./routes";

export default (
  fastify: FastifyInstance,
  opts: FastifyRegisterOptions<{ prefix: string }>,
): void => {
  fastify.log.info("Configuring /auth");
  fastify.register(routes, opts);
};
