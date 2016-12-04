(function(){
    angular
        .module("WebAppMakerApp")
        .factory("StatementService", statementService);

    function statementService($http) {
        //var math = require('mathjs');
        var StringOperations = {
            "SUBSTRING" : substring,
            "LENGTH" : length,
            "CONCATENATE": concat,
            "CHARAT": charAt,
            "INDEXOF": indexOf,
            "LASTINDEXOF": lastIndexOf,
            "SEARCH": search,
            "REPEAT": repeat,
            "REPLACE": replace,
            "SLICE": slice,
            "LOWERCASE": toLowerCase,
            "UPPERCASE": toUpperCase,
            "TRIM": trim,
            "STARTSWITH": startsWith,
            "ENDSWITH": endsWith,
        };

        var StringOperationArguments = {
            "SUBSTRING": ["input1", "start", "end"],
            "LENGTH": ["input1"],
            "CONCATENATE": ["input1", "input2"],
            "CHARAT": ["input1", "index"],
            "INDEXOF": ["input1", "searchvalue", "start" ],
            "LASTINDEXOF": ["input1", "searchvalue", "start"],
            "SEARCH": ["input1", "searchvalue" ],
            "REPEAT": ["input1", "count"],
            "REPLACE": ["input1", "searchvalue", "newvalue" ],
            "SLICE":  ["input1", "start", "end"],
            "LOWERCASE": ["input1"],
            "UPPERCASE": ["input1"],
            "TRIM": ["input1"],
            "STARTSWITH": ["input1", "searchvalue", "start" ],
            "ENDSWITH": ["input1", "searchvalue", "length" ],
        }

        var NumberOperationArguments = {
            "+": ["input1", "input2"],
            "-": ["input1", "input2"],
            "x": ["input1", "input2"],
            "/": ["input1", "input2"],
            "^": ["input1", "input2"],
        }

        var BooleanOperations = {
            "AND": "and",
            "OR": "or",
            "Equal to": "==",
            "NOT Equal": "!=",
            "Greater than": ">",
            "Greater than or equal": ">=",
            "Less than": "<",
            "Less than or equal": "<=",
        }

        var BooleanOperationArguments = {
            "AND": ["input1", "input2"],
            "OR": ["input1", "input2"],
            "Equal to": ["input1", "input2"],
            "NOT Equal": ["input1", "input2"],
            "Greater than": ["input1", "input2"],
            "Greater than or equal": ["input1", "input2"],
            "Less than": ["input1", "input2"],
            "Less than or equal": ["input1", "input2"],
        }


        var api = {
            addStatement : addStatement,
            findStatement: findStatement,
            deleteStatement: deleteStatement,
            saveStatement: saveStatement,
            findAllStatements: findAllStatements,
            runStatement: runStatement
        };
        return api;

        function findAllStatements(scope){
            var url  = apiBaseUrl(scope);
            url += "/script/"+scope.scriptId+"/statement/";
            return $http.get(url);
        }

        function deleteStatement(scope) {
            var url  = apiBaseUrl(scope);
            url += "/script/"+scope.scriptId+"/statement/" + scope.statementId;
            return $http.delete(url);
        }

        function saveStatement(scope, statement) {
            var url  = apiBaseUrl(scope);
            url += "/script/"+scope.scriptId+"/statement/" + scope.statementId;
            return $http.put(url, statement);
        }

        // retrieve statement
        function findStatement(scope) {
            var url  = apiBaseUrl(scope);
                url += "/script/"+scope.scriptId+"/statement/" + scope.statementId;
            return $http.get(url);
        }

        // notify server of new statement
        function addStatement(scope, statementType) {
            var url  = "/api";
                url += "/website/"+scope.websiteId;
                url += "/page/"+scope.pageId;
                url += "/widget/"+scope.widgetId;
                url += "/script/"+scope.scriptId+"/statement/"+statementType;
            return $http.post(url);
        }
        
        function apiBaseUrl(scope) {
            var url  = "/api";
                url += "/developer/"+scope.developerId;
                url += "/website/"+scope.websiteId;
                url += "/page/"+scope.pageId;
                url += "/widget/"+scope.widgetId;
            return url;
        }

        function runStatement(widgets, statement){
            var type = statement.statementType;
            if("STRING" === type)
                runStringStatement(widgets, statement.stringStatement);
            else if("NUMBER" === type)
                runNumberStatement(widgets, statement.numberStatement);
            else if("BOOLEAN" === type)
                runBooleanStatement(widgets, statement.booleanStatement);

        }

        function runBooleanStatement(widgets, booleanStatement){
            var args = [];
            var funcArgNames = BooleanOperationArguments[booleanStatement.operationType];
            for (var i = 0; i < funcArgNames.length; ++i) {
                var argName = funcArgNames[i];
                var arg = booleanStatement[argName];

                for (var j = 0; j < widgets.length; ++j) {
                    var widget = widgets[j];
                    if (widget.name == arg) {
                        arg = widget.text;
                        break;
                    }
                }
                args.push(arg);
            }


            var outputWidget;
            for( var i = 0 ; i < widgets.length; ++i){
                var widget = widgets[i];
                if(widget.name == booleanStatement.output){
                    outputWidget = widget;
                    break;
                }
            }

            /*
            if( false === isNaN(args[0]) && false === isNaN(args[1])) {
                var mathExpression = '(' + args[0] + ')' + BooleanOperations[booleanStatement.operationType] + '(' + args[1] + ')';
                var result = math.eval(mathExpression);
                outputWidget.text = result;
            }
            else{
                outputWidget.text = "Operands must be a number"
            }
            */
            var mathExpression = '(' + args[0] + ')' + BooleanOperations[booleanStatement.operationType] + '(' + args[1] + ')';
            var result = math.eval(mathExpression);
            outputWidget.text = result;

        }

        function runNumberStatement(widgets, numberStatement){
            var args = [];
            var funcArgNames = NumberOperationArguments[numberStatement.operationType];
            for (var i = 0; i < funcArgNames.length; ++i) {
                var argName = funcArgNames[i];
                var arg = numberStatement[argName];

                for (var j = 0; j < widgets.length; ++j) {
                    var widget = widgets[j];
                    if (widget.name == arg) {
                        arg = widget.text;
                        break;
                    }
                }
                args.push(arg);
            }


            var outputWidget;
            for( var i = 0 ; i < widgets.length; ++i){
                var widget = widgets[i];
                if(widget.name == numberStatement.output){
                    outputWidget = widget;
                    break;
                }
            }

            var mathExpression = '(' + args[0] + ')' + numberStatement.operationType + '(' + args[1] + ')';
            var result = math.eval(mathExpression);
            outputWidget.text = result;

            /*
            if( false === isNaN(args[0]) && false === isNaN(args[1])) {
                var mathExpression = '(' + args[0] + ')' + numberStatement.operationType + '(' + args[1] + ')';

                var result = math.eval(mathExpression);
                outputWidget.text = result;
            }else{
                outputWidget.text = "Operands must be a number"
            }
            */
        }

        function runStringStatement(widgets, stringStatement){
            var args = [];
            var funcArgNames = StringOperationArguments[stringStatement.operationType];
            for (var i = 0; i < funcArgNames.length; ++i) {
                var argName = funcArgNames[i];
                var arg = stringStatement[argName];

                for (var j = 0; j < widgets.length; ++j) {
                    var widget = widgets[j];
                    if (widget.name == arg) {
                        arg = widget.text;
                        break;
                    }
                }
                args.push(arg);
            }

            var outputWidget;
            for( var i = 0 ; i < widgets.length; ++i){
                var widget = widgets[i];
                if(widget.name == stringStatement.output){
                    outputWidget = widget;
                    break;
                }
            }

            var result = StringOperations[stringStatement.operationType](args);
            outputWidget.text = result;
        }

        function substring(args){
            return args[0].substring(args[1], args[2]);
        }

        function length(args){
            return args[0].length;
        }

        function concat(args){
            return args[0].concat(args[1]);
        }

        function charAt(args){
            return args[0].charAt(args[1]);
        }

        function indexOf(args){
            return args[0].indexOf(args[1], args[2]);
        }

        function indexOf(args){
            return args[0].indexOf(args[1], args[2]);
        }

        function lastIndexOf(args){
            return args[0].lastIndexOf(args[1], args[2]);
        }

        function search(args){
            return args[0].search(args[1], args[2]);
        }

        function repeat(args){
            return args[0].repeat(args[1]);
        }

        function replace(args){
            return args[0].replace(args[1], args[0]);
        }

        function slice(args){
            return args[0].slice(args[1], args[2]);
        }

        function toLowerCase(args){
            return args[0].toLowerCase();
        }

        function toUpperCase(args){
            return args[0].toUpperCase();
        }

        function trim(args){
            return args[0].trim();
        }

        function startsWith(args){
            return args[0].startsWith(args[1], args[2]);
        }

        function endsWith(args){
            return args[0].startsWith(args[1], args[2]);
        }
    }
})();