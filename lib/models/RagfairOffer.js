const { generateMongoID, getCurrentTimestamp } = require("../../utilities");
const { BaseModel } = require("./BaseModel");

class RagfairOffer extends BaseModel {
    constructor() {
        super();
    }

    async setIds(offerNumber) {
        this._id = await generateMongoID();
        this.intId = offerNumber;
    }

    async setUser(user) {
        this.user = user;
    }

    async setCosts(itemsCost) {
        this.itemsCost = itemsCost;
        this.requirementsCost = itemsCost;
        this.summaryCost = itemsCost;
    }

    async setOfferDuration(timestamp, offerEnd) {
        this.startTime = timestamp - 3600;
        this.endTime = offerEnd;
    }

    async setUnlimitedCount(unlimitedCount) {
        this.unlimitedCount = unlimitedCount;
    }

    async loadOffer(offerNumber, itemData, user, offerEnd) {
        const offerTimestamp = await getCurrentTimestamp();
        await this.setIds(offerNumber);
        await this.setUser(user);
        await this.setCosts(parseInt(itemData.barter[0].count));
        await this.setOfferDuration(offerTimestamp, offerEnd);
        this.root = itemData.item[0]._id;
        this.items = itemData.item;
        this.requirements = itemData.barter;
        this.sellInOnePiece = false;
        this.locked = false;
        this.loyaltyLevel = itemData.loyality;
        if (typeof itemData.item === "object" && itemData.item.hasOwnProperty("upd") && itemData.item.hasOwnProperty("UnlimitedCount")) {
            await this.setUnlimitedCount(itemData.item.upd.unlimitedCount);
        } else if (itemData.item[0].hasOwnProperty("upd") && itemData.item[0].hasOwnProperty("UnlimitedCount")) {
            await this.setUnlimitedCount(itemData.item[0].upd.unlimitedCount);
        } else {
            await this.setUnlimitedCount(false);
        }
    }
}

module.exports.RagfairOffer = RagfairOffer;