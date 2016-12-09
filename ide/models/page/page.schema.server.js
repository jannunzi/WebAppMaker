var mongoose = require("mongoose");

module.exports = function () {

    var WidgetSchema = require("../widget/widget.schema.server.js")();

    var PageSchema = mongoose.Schema({
        _website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
        name: String,
        title: String,
        x: Number,
        y: Number,
        widgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Widget' }],
        dateCreated: {type: Date, default: Date.now}
    });

    return PageSchema;
};