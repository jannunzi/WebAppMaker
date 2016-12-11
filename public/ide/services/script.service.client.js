(function(){
    angular
        .module("WebAppMakerApp")
        .factory("ScriptService", scriptService);

    function scriptService($http, StatementService) {
        var api = {
            createScript : saveScript,
            saveScript   : saveScript,
            findScript   : findScript,
            runScript : runScript
        };
        return api;
        
        function findScript(scope) {
            var url  = "/api";
                url += "/website/"+scope.websiteId;
                url += "/page/"+scope.pageId;
                url += "/widget/"+scope.widgetId;
                url += "/script";
            return $http.get(url);
        }

        function saveScript(scope, script) {
            var url  = "/api";
                url += "/website/"+scope.websiteId;
                url += "/page/"+scope.pageId;
                url += "/widget/"+scope.widgetId;
                url += "/script";
            return $http.post(url, script);
        }

        function apiBaseUrl(scope) {
            var url  = "/api";
                url += "/website/"+scope.websiteId;
                url += "/page/"+scope.pageId;
                url += "/widget/"+scope.widgetId;
            return url;
        }

        function runScript(widgets, statements){
            for(var i = 0 ; i < statements.length; ++i) {
                StatementService.runStatement(widgets, statements[i]);
            }
        }
    }
})();