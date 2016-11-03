(function(){
    angular
        .module("WebAppMakerApp")
        .factory("FlowDiagramService", FlowDiagramService);
    
    function FlowDiagramService() {
        var diagram = [];
        var api = {
            addNode: addNode,
            getDiagram: getDiagram
        };
        return api;
        function addNode(node) {
            diagram.push(node);
        }
        function getDiagram() {
            return diagram;
        }
    }
})();