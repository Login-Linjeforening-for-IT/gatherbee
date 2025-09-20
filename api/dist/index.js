"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = __importDefault(require("./routes"));
const getIndex_1 = __importDefault(require("./handlers/index/getIndex"));
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.decorate('cachedJSON', Buffer.from(''));
fastify.register(cors_1.default, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
});
const port = Number(process.env.PORT) || 8080;
fastify.register(routes_1.default, { prefix: "/api" });
fastify.get('/', getIndex_1.default);
async function start() {
    try {
        await fastify.listen({ port, host: '0.0.0.0' });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
async function main() {
    start();
}
main();
