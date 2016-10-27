(function () {
    angular
        .module ("WebAppMakerApp")
        .factory('Pagination', Pagination)
        .controller ("PageRunController",  pageRunController)
        .controller ("PageListController", pageListController)
        .controller ("NewPageController",  newPageController)
        .controller ("EditPageController", editPageController);

    function pageRunController (DatabaseService, $routeParams, WebsiteService, WidgetService, PageService, $sce,
                                $location, $scope, $rootScope, Pagination) {
        var vm = this;
        vm.developerId   = $routeParams.developerId;
        vm.username      = $routeParams.username;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;

        vm.safeYouTubeUrl = safeYouTubeUrl;
        vm.getButtonClass = getButtonClass;
        vm.trustAsHtml    = trustAsHtml;
        vm.buttonClick    = buttonClick;
        vm.deleteRecord   = deleteRecord;

        vm.datatableMethods = {}; // contains sort, filter info of all datatables

        vm.setPage = setPage; // set the current page
        vm.initializeDataTableMethods = initializeDataTableMethods; // initialize data table methods

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

        // initialize the datatable methods
        function initializeDataTableMethods(id, data) {
            vm.datatableMethods[id] = {
                'orderByField': '',
                'reverseSort': false,
                'search': {},
                'data': data ,
                'pager': {},
                'page_items': []
            };
        }

        // set current page for datatable
        function setPage(page, id, rows) {
            if (page < 1 || page > vm.datatableMethods[id]['pager'].totalPages) {
                return;
            }

            // get pager object from service
            vm.datatableMethods[id]['pager'] = Pagination.GetPager(vm.datatableMethods[id]['data'].length, page, rows);

            // get current page of items
            vm.datatableMethods[id]['page_items'] = vm.datatableMethods[id]['data'].slice(vm.datatableMethods[id]['pager'].startIndex,
                vm.datatableMethods[id]['pager'].endIndex);
        }

        // handle delete button event
        function deleteRecord(widgetType, collectionName, recordId) {
            DatabaseService
                .delete(vm.websiteId, $rootScope.currentUser.username, vm.website.name, collectionName, recordId)
                .then(
                    function(){
                        DatabaseService
                            .select($rootScope.currentUser.username, vm.website.name, collectionName)
                            .then(
                                function (response) {
                                    response.data.reverse();
                                    vm.data = response.data;
                                },
                                function (err) {
                                    vm.error = err;
                                }
                            );
                    }
                );
        }

        // button click event handler
        function buttonClick(widget) {

            // if button has db command, then use service to execute
            if(widget.button && widget.button.dbCommand) {
                console.log(vm.fields);
                DatabaseService
                    .executeCommand(widget.button.dbCommand, $rootScope.currentUser.username, vm.website.name, vm.page.name, vm.fields)
                    .then(
                        function(response){
                            // if button has navigate, then go there
                            if(widget.button && widget.button.navigate) {
                                var currentUrl = $location.url();
                                var nextUrl = "/developer/"+$rootScope.currentUser._id+"/website/"+vm.websiteId+"/page/"+widget.button.navigate+"/run";
                                if(currentUrl != nextUrl) {
                                    $location.url("/developer/"+$rootScope.currentUser._id+"/website/"+vm.websiteId+"/page/"+widget.button.navigate+"/run");
                                } else
                                {
                                    init();
                                }
                            }
                        },
                        function(err){
                            vm.errors = err;
                        }
                    );
            } else {
                // if button has navigate, then go there
                if(widget.button && widget.button.navigate) {
                    $location.url("/developer/"+$rootScope.currentUser._id+"/website/"+vm.websiteId+"/page/"+widget.button.navigate+"/run");
                }
            }
        }

        function trustAsHtml(html, fields) {
            if(fields) {
                for(var key in fields) {
                    if(fields.hasOwnProperty(key)) {
                        var value = fields[key];
                        key = "{{"+key+"}}";
                        html = html.replace(key, value);
                    }
                }
                return $sce.trustAsHtml(html);
            }
            return $sce.trustAsHtml(html);
        }

        function getButtonClass(style) {
            if(!style) {
                style = "default";
            }
            return "btn-"+style.toLowerCase();
        }

        function safeYouTubeUrl(widget) {
            if(widget && widget.youTube) {
                var urlParts = widget.youTube.url.split("/");
                var youTubeId = urlParts[urlParts.length-1];
                return $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+youTubeId);
            }
            return "";
        }
    }

    function Pagination() {
        // service definition
        var service = {};

        service.GetPager = GetPager;

        return service;

        // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = startIndex + pageSize;

            // create an array of pages to ng-repeat in the pager control
            var pages = [];
            for (var i=startPage; i<endPage + 1; i++) {
                pages.push(i);
            }

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    }

    function editPageController ($routeParams, WebsiteService, PageService, $location) {

        var vm = this;
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;

        vm.removePage    = removePage;
        vm.updatePage    = updatePage;

        vm.viewType = 'list';

        vm.sortPage      = sortPage;
        vm.toggleView    = toggleView;

        function sortPage(start, end) {
            PageService
                .sortPage(vm.websiteId, start, end)
                .then(
                    function (response) {
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }

        function toggleView() {
            vm.viewType = vm.viewType === 'list' ? 'grid' : 'list';
        }

        function init() {
            PageService
                .findPage(vm.websiteId, vm.pageId)
                .then(
                    function (response) {
                        vm.page = response.data;
                    },
                    function (err) {
                        vm.error = err;
                    }
                );

            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response){
                        vm.website = response.data;
                        return PageService
                            .findPagesForWebsite(vm.websiteId);
                    },
                    function(error){
                        vm.error = error;
                    }
                )
                .then(
                    function (response) {
                        vm.pages = response.data;
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function updatePage(page) {
            PageService
                .updatePage(page._id, page)
                .then(
                    function (response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page");
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }

        function removePage(page) {
            PageService
                .removePage(vm.pageId)
                .then(
                    function (response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page");
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }
    }

    function pageListController ($routeParams, PageService, WebsiteService) {

        var vm = this;
        vm.developerId = $routeParams.developerId;
        vm.websiteId = $routeParams.websiteId;
        vm.viewType = 'list';
        vm.sortBy = 'name';
        vm.reverse = false;

        vm.sortPage      = sortPage;
        vm.toggleView    = toggleView;
        vm.setSortReverse = setSortReverse;
        vm.setSortBy = setSortBy;
        vm.sortList = sortList;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response){
                        vm.website = response.data;
                        return PageService
                            .findPagesForWebsite(vm.websiteId);
                    },
                    function(error){
                        vm.error = error;
                    }
                )
                .then(
                    function (response) {
                        vm.pages = response.data;
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function sortPage(start, end) {
            PageService
                .sortPage(vm.websiteId, start, end)
                .then(
                    function (response) {
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        
        function toggleView() {
            vm.viewType = vm.viewType === 'list' ? 'grid' : 'list';
        }

        function setSortReverse(reverse) {
            vm.reverse = reverse;
        }

        function setSortBy(by) {
            vm.sortBy = by;
        }

        function sortList(by, reverse) {
            vm.sortBy = by;
            vm.reverse = reverse;
        }
    }

    function newPageController($routeParams, WebsiteService, PageService, $location) {

        var vm = this;
        vm.developerId = $routeParams.developerId;
        vm.websiteId = $routeParams.websiteId;
        vm.createPage = createPage;

        vm.viewType = 'list';

        vm.sortPage      = sortPage;
        vm.toggleView    = toggleView;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response){
                        vm.website = response.data;
                        return PageService
                            .findPagesForWebsite(vm.websiteId);
                    },
                    function(error){
                        vm.error = error;
                    }
                )
                .then(
                    function (response) {
                        vm.pages = response.data;
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function createPage(page) {
            PageService
                .createPage(vm.websiteId, page)
                .then(
                    function(response) {
                        var page = response;
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page");
                    }
                )
        }

        function sortPage(start, end) {
            PageService
                .sortPage(vm.websiteId, start, end)
                .then(
                    function (response) {
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }

        function toggleView() {
            vm.viewType = vm.viewType === 'list' ? 'grid' : 'list';
        }
    }

})();