(function () {
    angular
        .module ("WebAppMakerApp")
        //.factory('Pagination', Pagination)
        .controller ("FlowController",  flowController);

        function flowController ($routeParams, FlowDiagramService) {
        var vm = this;
        vm.developerId   = $routeParams.developerId;
        vm.username      = $routeParams.username;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;

        function init() {
            FlowDiagramService
                .getFlowDiagram(vm.developerId, vm.websiteId)
                .success(function(diagram){
                    vm.diagram = diagram;
                })
        }
        init();

    }

})();