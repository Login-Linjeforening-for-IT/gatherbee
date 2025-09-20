"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getIndex;
/**
 * Base information about the api if the route was not specified
 * @param req FastifyRequest, used to fetch the valid routes
 * @param res FastifyReply, used to send the response to the user
 */
async function getIndex(req, res) {
    const routes = req.server.printRoutes({ commonPrefix: false });
    res.send(`GatherBee API.\n\nValid endpoints are:\n\n${routes}`);
}
