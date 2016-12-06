(function () {
    angular
        .module ("WebAppMakerApp")
        //.factory('Pagination', Pagination)
        .controller ("FlowController",  flowController);
        // .controller ("ElementAddController",  elementAddController)
        // .controller ("ElementEditController",  elementEditController);

        function flowController ($routeParams, FlowDiagramService) {
            var vm = this;
            vm.developerId = $routeParams.developerId;
            vm.username = $routeParams.username;
            vm.websiteId = $routeParams.websiteId;
            vm.pageId = $routeParams.pageId;
            vm.drawPretty = drawPretty;
            vm.returnNode = returnNode;

            function init() {
                FlowDiagramService
                    .getFlowDiagram(vm.developerId, vm.websiteId)
                    .success(function (diagram) {
                        vm.diagram = diagram;
                        vm.diagramId = diagram._id;
                        FlowDiagramService
                            .getNodeForFlow(vm.developerId, vm.websiteId, vm.diagramId)
                            .success(function (nodes) {
                                //console.log(nodes);
                                vm.nodes = nodes;
                            });
                        FlowDiagramService
                            .getConnectionForFlow(vm.developerId, vm.websiteId, vm.diagramId)
                            .success(function (connections) {
                                //console.log(connections);
                                vm.connections = connections;
                            })


                    })
                    .error(function () {
                                    vm.error = "error";
            })}



            init();



            function drawPretty(nodeId1, nodeId2) {
                //input: id of two nodes(connect-from and connect-to)
                //output: a list store [x4,y4,x3,y3]
                //represents x,y coordinates of starting point and arrow(end point)

                var node1 = returnNode(nodeId1);
                var node2 = returnNode(nodeId2);

                var x1 = node1.x + 75; //75 is the approximation of diagonal of box
                var y1 = node1.y + 75;
                var x2 = node2.x + 75;
                var y2 = node2.y + 75;
                var x3 = 0;
                var y3 = 0;
                // x3 and y3 are coordinate for new end point of line
                var x4 = 0;
                var y4 = 0;
                // x4 and y4 are coordinate for new starting point of line
                var d = Math.sqrt((y1 - y2)*(y1 - y2) + (x1 - x2)*(x1 - x2));
                //d is the distance between node1 and node2
                var p = 140 * (Math.abs(x1 - x2)) / d;
                //140 is the approximation of the distance from arrow to the center of box
                var q = 140 * (Math.abs(y1 - y2)) / d;
                // p is the the x coordinate correct factor of x3
                // q is the the y coordinate correct factor of y3


                if (x1 >= x2){
                    x3 = x2 + p;
                    x4 = x1 - p/1.4;    //1.4 is the approximation of the scale of start point
                }
                else{
                    x3 = x2 - p;
                    x4 = x1 + p/1.4;
                }
                if(y1 >= y2){
                    y3 = y2 + q  ;
                    y4 = y1 - q/1.4 ;
                }
                else{
                    y3 = y2 - q ;
                    y4 = y1 + q/1.4 ;
                }

                var answer = [x4, y4, x3, y3];
                // answer is a list to store the x,y coordinates of node1, node2 and arrow
                return answer;
            }


            function returnNode(nodeId) {
                //given the id of a node, return it from the vm.nodes
                for(var n in vm.nodes) {
                    if(vm.nodes[n]._id === nodeId) {
                        return vm.nodes[n];
                    }
                }
                return null;


            }


        }
})();