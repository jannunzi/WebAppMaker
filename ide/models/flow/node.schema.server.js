var mongoose = require("mongoose");

module.exports = function () {

    var NodeSchema = mongoose.Schema({
        _flow: {type: mongoose.Schema.Types.ObjectId, ref: 'Flow'},
        x: Number,
        y: Number,
        name: String,
        type: {type: String, enum: ['PAGE', 'ACTION', 'DECISION']},
        page: {type: mongoose.Schema.Types.ObjectId, ref: 'Page'},
        action: {type: mongoose.Schema.Types.ObjectId, ref: 'Action'}
        //decision: {type: mongoose.Schema.Types.ObjectId, ref: 'Decision'}
    }, {collection: "node"});

    return NodeSchema;
};
