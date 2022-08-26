const { FastifyResponse, logger, stringify } = require("../../utilities");

class NotificationController {
    constructor() {
        this.bundles = [];
    }

    /**
     * Upgrade notifier
     * @returns 
     */
    static async onUpgrade(request, socket, head) {
        const { database: { core: { connections } } } = require("../../app");
        const sockedId = socket.server.sessionIdContext;

        connections.webSocket[sockedId] = socket;

        if (connections.webSocketPings) {
            clearInterval(connections.webSocketPings);
        }

        connections.webSocketPings = setInterval(() => {
            logger.logSuccess(`[WebSocket] Pinging Player: ${sockedId}`);
            if (connections.webSocket[sockedId].readyState === "open") {
                connections.webSocket[sockedId].on("message", message => {
                    connections.webSocket[sockedId].send(
                        stringify(
                            {
                                type: "ping",
                                eventId: "ping"
                            }
                        )
                    )
                })
            } else {
                logger.logDebug(`[WebSocket] Socket lost, deleting handle`);
                clearInterval(connections.webSocketPings);

                delete connections.webSocket[sockedId];
            }
        }, 90000)
    }
}
module.exports.NotificationController = NotificationController;