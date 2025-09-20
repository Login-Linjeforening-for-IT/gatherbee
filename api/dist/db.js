"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const pg_1 = __importDefault(require("pg"));
const _constants_1 = __importDefault(require("./constants"));
const { DB, DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_MAX_CONN, DB_IDLE_TIMEOUT_MS, DB_TIMEOUT_MS } = _constants_1.default;
const { Pool } = pg_1.default;
const pool = new Pool({
    user: DB_USER || "gatherbee",
    host: DB_HOST,
    database: DB || "gatherbee",
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432,
    max: Number(DB_MAX_CONN) || 20,
    idleTimeoutMillis: Number(DB_IDLE_TIMEOUT_MS) || 5000,
    connectionTimeoutMillis: Number(DB_TIMEOUT_MS) || 3000
});
async function run(query, params) {
    const client = await pool.connect();
    try {
        return await client.query(query, params ?? []);
    }
    catch (error) {
        throw error;
    }
    finally {
        client.release();
    }
}
