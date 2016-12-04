var mongoose = require("mongoose");

module.exports = function() {

    var BooleanStatementSchema = mongoose.Schema({
        operationType : {type : String, enum : ['AND', 'OR', 'Equal to', 'NOT Equal','Greater than','Greater than or equal', 'Less than', 'Less than or equal']},
        input1        : String,
        input2        : String,
        output        : String
    });

    return BooleanStatementSchema;
};