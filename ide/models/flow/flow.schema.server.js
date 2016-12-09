var mongoose = require("mongoose");

module.exports = function () {

    // var PageSchema = require("../page/page.schema.server.js")();

    var FlowSchema = mongoose.Schema({
        _developer: {type: mongoose.Schema.Types.ObjectId, ref: 'Developer'},
        _website: {type: mongoose.Schema.Types.ObjectId, ref: 'Website'},
        nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }],
        connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connection' }]
    }, {collection: "flow"});

    return FlowSchema;
};