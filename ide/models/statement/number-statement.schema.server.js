var mongoose = require("mongoose");

module.exports = function() {

    var NumberStatementSchema = mongoose.Schema({
        operationType : {type : String, enum : ["+", "-", "x", "/", "power"]},
        input1        : String,
        input2        : String,
        output        : String
    });

    return NumberStatementSchema;
};