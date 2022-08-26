const { stringify, logger } = require("../../utilities");
const { BaseModel } = require("./BaseModel");

class Notification extends BaseModel {
    constructor(id) {
        super(id);

        this.createDatabase(id);
    }

    async createNewNotification(message) {
        return {
            type: "new_message",
            eventId: message._id,
            dialogId: message.uid,
            message: message
        };
    }

    async sendNotification(socketId, message) {
        const { database: { core: { connections } } } = require("../../app");

        if (connections.webSocket[socketId] !== undefined && connections.webSocket[socketId].readyState === 1) {
            connections.webSocket[socketId].on("message", _message => {
                connections.webSocket[socketId].send(stringify(message))
            });
        } else {
            logger.logError("Notification was not sent, shit!")
        }
    }
}

module.exports.Notification = Notification;
