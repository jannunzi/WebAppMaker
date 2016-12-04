(function(){
    angular
        .module("WebAppMakerApp")
        .factory("StatementService", statementService);

    function statementService($http) {
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
            if("STRING" === statement.statementType) {
                var stringStatement = statement.stringStatement;
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