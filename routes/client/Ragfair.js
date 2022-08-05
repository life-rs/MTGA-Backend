const { Ragfair } = require("../../lib/models/Ragfair");
const { FastifyResponse } = require("../../utilities");


module.exports = async function ragfairRoutes(app, _opts) {

    app.post(`/client/ragfair/find`, async (request, reply) => {
        console.log(request.body);
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(await Ragfair.generateOffersBasedOnRequest(request.body))
        );
    });
};