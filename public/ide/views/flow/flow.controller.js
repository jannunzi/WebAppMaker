(function () {
    angular
        .module ("WebAppMakerApp")
        //.factory('Pagination', Pagination)
        .controller ("FlowController",  flowController);

        function flowController (DatabaseService, $routeParams, WebsiteService, WidgetService, PageService, $sce,
                                $location, $scope, $rootScope, Pagination) {
        var vm = this;
        vm.developerId   = $routeParams.developerId;
        vm.username      = $routeParams.username;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response){
                        vm.website = response.data;
                        return PageService
                            .findPageById(vm.pageId);
                    }
                )
                .then(
                    function(response) {
                        vm.page = response.data;
                        return  WidgetService.getWidgets(vm.websiteId, vm.pageId);
                    }
                )
                .then(
                    function(response) {
                        // need page for page name and widgets to render the page
                        vm.widgets    = response.data;
                        // vm.widgets = vm.page.widgets;
                        // look for DATATABLE widgets and fetch their data from database
                        for(var w in vm.widgets) {
                            // now both the DATATABLE and the REPEATER widgets need data
                            if(vm.widgets[w].widgetType=="DATATABLE" || vm.widgets[w].widgetType=="REPEATER" ) {
                                vm.collectionName = vm.widgets[w].widgetType=="DATATABLE" ? vm.widgets[w].datatable.collectionName : vm.widgets[w].repeater.collectionName;
                                DatabaseService
                                // had to rename 'collection' to 'collectionName' on the schema
                                    .select($rootScope.currentUser.username, vm.website.name, vm.collectionName)
                                    .then(
                                        function (response) {
                                            response.data.reverse();
                                            vm.data = response.data;
                                            if(vm.widgets[w].widgetType == 'DATATABLE')
                                            {
                                                initializeDataTableMethods(vm.widgets[w]._id, vm.data);
                                                vm.setPage(1, vm.widgets[w]._id, vm.widgets[w].datatable.pageRows);
                                            }
                                        },
                                        function (err) {
                                            vm.error = err;
                                        }
                                    );
                            }
                        }
                    }
                );
        }
        init();

    }

})();