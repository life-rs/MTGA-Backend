const { logger, FastifyResponse } = require("../utilities");
const { NotificationController } = require("../lib/controllers/NotificationController")


module.exports = async function notifierRoutes(app, _opt) {

    // Client Notifier Routes //
    app.post("/client/WebSocketAddress", async (_request, reply) => {
        return FastifyResponse.zlibReply(
            reply,
            FastifyResponse.getWebSocketUrl()
        );
    });

    app.post("/client/notifier/channel/create", async (request, reply) => {
        const sessionID = await FastifyResponse.getSessionID(request);
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(FastifyResponse.getNotifier(sessionID))
        );
    });

    app.post("/:sessionID", async (_request, reply) => {
        logger.logError("NOTIFIER GET HIT");
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody("ok")
        );
    });

    app.get("/socket", { websocket: true }, async (connection, request) => {
        await NotificationController.onUpgrade(connection, request);
    });

};
