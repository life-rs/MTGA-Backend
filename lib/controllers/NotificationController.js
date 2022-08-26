const { FastifyResponse, logger, stringify } = require("../../utilities");

class NotificationController {
    constructor() {
        this.bundles = [];
    }

    /**
     * Upgrade notifier
     * @returns 
     */
    static async onUpgrade(connection, request) {
        const { database: { core: { connections } } } = require("../../app");
        const sockedId = connection.socket._socket._parent._server.sessionIdContext;

        connections.webSocket[sockedId] = connection.socket;

        if (connections.webSocketPings) {
            clearInterval(connections.webSocketPings);
        }

        connections.webSocketPings = setInterval(() => {
            if (connections.webSocket[sockedId]._readyState === 1) {
                logger.logSuccess(`[WebSocket] Pinging Player: ${sockedId}`);
                connections.webSocket[sockedId].send(
                    stringify(
                        {
                            type: "ping",
                            eventId: "ping"
                        }
                    )
                )
            } else {
                logger.logError(`[WebSocket] Ping to player ${sockedId} failed, deleting handle`);
                clearInterval(connections.webSocketPings);
                delete connections.webSocket[sockedId];
            }
        }, 90000)
    }
}
module.exports.NotificationController = NotificationController;