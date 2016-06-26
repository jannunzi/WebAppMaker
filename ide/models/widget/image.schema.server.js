var mongoose = require("mongoose");

module.exports = function () {

    var ImageSchema = mongoose.Schema({
        url   : String,
        width : String,
        height: String,
        user_Id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }
        
    });

    return ImageSchema;
};