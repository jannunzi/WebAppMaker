var mongoose = require("mongoose");

module.exports = function() {

    var StringStatementSchema = mongoose.Schema({
        operationType : {type : String, enum : ["SUBSTRING", "CONCATENATE", "LENGTH","CHARAT","INDEXOF","LASTINDEXOF",
            "SEARCH","REPEAT","REPLACE","SLICE","LOWERCASE","UPPERCASE","TRIM",
            "STARTSWITH", "ENDSWITH"]},
        input1        : String,
        input2        : String,
        output        : String,
        length        : String,
        start         : String,
        end           : String,
        index         : String,
        searchvalue   : String,
        newvalue      : String,
        count         : String
    });

    return StringStatementSchema;
};