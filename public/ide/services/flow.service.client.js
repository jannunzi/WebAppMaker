(function(){
    angular
        .module("WebAppMakerApp")
        .factory("FlowDiagramService", FlowDiagramService);
    
    function FlowDiagramService($http) {

        var api = {
            getFlowDiagram: getFlowDiagram,
            getNodeForFlow: getNodeForFlow,
            getConnectionForFlow: getConnectionForFlow,
            getNodeById: getNodeById
        };
        return api;


        function getFlowDiagram(uid, wid) {
            var url = "/user/"+uid+"/website/"+wid+"/flow";
            return $http.get(url);
        }


        function getNodeById(uid, wid, fid, nid) {
            var url = "/user/"+uid+"/website/"+wid+"/flow/" + fid +"/node/"+nid;
            return $http.get(url);
        }

        function getConnectionForFlow(uid, wid, fid) {
            var url = "/user/"+uid+"/website/"+wid+"/flow/" + fid +"/connection";
            return $http.get(url);
        }

        function getNodeForFlow(uid, wid, fid) {
            var url = "/user/"+uid+"/website/"+wid+"/flow/" + fid +"/node";
            return $http.get(url);
        }

    }
})();