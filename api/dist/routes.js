"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiRoutes;
const getIndex_1 = __importDefault(require("./handlers/index/getIndex"));
async function apiRoutes(fastify, _) {
    // index
    fastify.get("/", getIndex_1.default);
}
