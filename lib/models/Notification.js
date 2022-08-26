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

    async sendNotification(sessionID, message) {
        const app = require("../../app");

        if (webSockets !== undefined && webSockets.readyState === "open") {
            webSockets.send(stringify(message));
        } else {
            logger.logError("Notification was not sent, shit!")
        }
    }
}

module.exports.Notification = Notification;
