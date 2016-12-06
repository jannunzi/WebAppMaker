module.exports = function () {
    var mongoose = require("mongoose");
    var FlowSchema = require("./flow.schema.server")();
    var FlowModel = mongoose.model("FlowModel", FlowSchema);


    var api = {
        getFlowDiagram: getFlowDiagram
    };
    return api;


    function getFlowDiagram(developerId, websiteId) {
        return FlowModel.findOne({_developer: developerId, _website: websiteId});
    }


};