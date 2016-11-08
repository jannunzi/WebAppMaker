(function(){
    angular
        .module("WebAppMakerApp")
        .factory("FlowDiagramService", FlowDiagramService);
    
    function FlowDiagramService($http) {
        var diagram = {
            nodes: [
                {_id: 123, x: 100, y: 100, type: 'PAGE', name: 'Page 1'},
                {_id: 223, x: 200, y: 100, type: 'PAGE', name: 'Page 2'},
                {_id: 323, x: 300, y: 200, type: 'PAGE', name: 'Page 3'},
                {_id: 423, x: 400, y: 200, type: 'PAGE', name: 'Page 4'},
                {_id: 523, x: 500, y: 100, type: 'PAGE', name: 'Page 5'}
            ],
            connections: [
                {from: 123, to: 223},
                {from: 223, to: 323},
                {from: 423, to: 523}
            ]
        };
        var api = {
            addNode: addNode,
            getNodes: getNodes,
            removeNode: removeNode,
            updateNode: updateNode,
            getFlowDiagram: getFlowDiagram,
            addConnection: addConnection,
            getConnections:getConnections,
            removeConnection: removeConnection,
            updateConnection: updateConnection
        };
        return api;
        function addNode(node) {
            diagram.nodes.push(node);
        }
        function getNodes() {
            return diagram.nodes;
        }
        function removeNode(node) {

        }
        function updateNode(node) {

        }
        function getFlowDiagram(uid, wid) {
            var url = "/user/"+uid+"/website/"+wid+"/flow";
            return $http.get(url);
        }
        function addConnection(connection) {
            diagram.connections.push(connection);
        }
        function getConnections() {
            return diagram.connections;
        }
        function removeConnection(connection) {

        }
        function updateConnection(connection) {

        }
    }
})();