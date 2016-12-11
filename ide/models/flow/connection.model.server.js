module.exports = function () {
    var mongoose = require("mongoose");
    var ConnectionSchema = require("./connection.schema.server")();
    var ConnectionModel = mongoose.model("ConnectionModel", ConnectionSchema);


    var api = {
        getConnectionForFlow: getConnectionForFlow
    };
    return api;


    function getConnectionForFlow(developerId, websiteId, flowId) {
        return ConnectionModel.find({"_flow": flowId});
    }
// db.connection.find({"_flow": ObjectId("5843af551f0a92ccd7f1ced4")})
};