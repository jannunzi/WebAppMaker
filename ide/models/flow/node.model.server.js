module.exports = function () {
    var mongoose = require("mongoose");
    var NodeSchema = require("./node.schema.server")();
    var NodeModel = mongoose.model("NodeModel", NodeSchema);


    var api = {
        getNodeForFlow: getNodeForFlow,
        getNodeById: getNodeById,
        updateNodeById: updateNodeById
    };
    return api;


    function getNodeById(developerId, websiteId, flowId, nodeId) {
        return NodeModel.findById(nodeId);
    }

    function getNodeForFlow(developerId, websiteId, flowId) {
        console.log(flowId);
        return NodeModel.find({"_flow": flowId});
    }

    function updateNodeById(nodeId, nodeObj) {
        return NodeModel.findById(nodeId).update(nodeObj);
    }

};