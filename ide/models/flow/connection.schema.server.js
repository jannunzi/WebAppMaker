var mongoose = require("mongoose");

module.exports = function () {

    var ConnectionSchema = mongoose.Schema({
        _flow: {type: mongoose.Schema.Types.ObjectId, ref: 'Flow'},
        from:  {type: mongoose.Schema.Types.ObjectId, ref: 'Node'},
        to:    {type: mongoose.Schema.Types.ObjectId, ref: 'Node'},
    }, {collection: "connection"});

    return ConnectionSchema;
};
