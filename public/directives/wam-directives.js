(function () {
    angular
        .module("wamDirectives", [])
        .directive("wamFilter", wamFilter)
        .directive("jgaDraggable", jgaDraggable)
        .directive("jgaDroppable", jgaDroppable)
        .directive("jgaSortable", jgaSortable);

    var websiteId;
    var pageHtml = "<div jga-draggable class='panel panel-primary'><div class='panel-heading ng-binding'> Page panel <a style='background-color: #ffffcc'> <span class='glyphicon glyphicon-cog'> </span> </a><a class='removePage' id='PAGE_ID' style='background-color: #ffffcc'><span class='glyphicon glyphicon-remove'> </span></a></div><div class='panel-body'><h3 class='node'><a><img class='img-thumbnail mx-auto' src='./images/glyphicons-pages.png'></a></h3></div></div>";

    function jgaDraggable() {
        function link(scope, element, attributes) {
            console.log("jgaDraggable");
            console.log([scope, element, attributes]);
            element.draggable({
                helper: "clone"
            });
        }
        return {
            restrict: 'EA',
            link: link,
            controller: 'FlowController'
        };
    }

    function createdefaultPage(websiteId,page)
    {
        console.log("Inside defult");
        return PageService.createPage(page);
    }

    function jgaDroppable(FlowDiagramService, PageService, $compile) {

        var canvas;

        $('body').on('click', '.removePage', function (event) {
            var element = $(event.currentTarget);
            var id = element.attr('id');
            PageService
                .removePage(id)
                .success(function(){
                    renderDiagram(canvas,pageHtml);
                });
        });

        console.log(PageService);
        var actionHtml = "<h3 class='node'>Action</h3>";
        var conditionalHtml = "<h3 class='node'>Conditional</h3>";
        function link(scope, element, attributes) {

            var model123 = scope.model,
                developerId = model123.developerId,
                pageId = model123.pageId,
                url = '#/developer/' + developerId + '/website/' + websiteId + '/flow/123/page/'+ pageId;

            websiteId = model123.websiteId;
            var newPage = {name : "New Page", title : "default"};
            console.log("jgaDroppable");
            console.log([scope, element, attributes]);
            canvas = element;
            renderDiagram(canvas,pageHtml);
            canvas.droppable({
                drop: function(qq, ww){
                    console.log(model123);
                    console.log("dropped");
                    // createdefaultPage(websiteId, newPage);
                    console.log(PageService);

                    var helper = $(ww.helper);
                    var position = helper.position();
                    position.left -= canvas.position().left;
                    newPage.x = position.left;
                    newPage.y = position.top;
                    PageService.createPage(websiteId, newPage)
                        .then(function(page){
                            var pageModel   = model123.pageModel;
                            console.log(page);
                            url = '#/developer/' + developerId + '/website/' + websiteId + '/flow/123/page/PAGE_ID';

                            pageHtml = "<div jga-draggable class='panel panel-primary'><div class='panel-heading ng-binding'> Page panel <a href=" + url + " style='background-color: #ffffcc'> <span class='glyphicon glyphicon-cog'> </span> </a><a class='removePage' id='PAGE_ID' style='background-color: #ffffcc'><span class='glyphicon glyphicon-remove'> </span></a></div><div class='panel-body'><h3 class='node'><a href=" + url + "><img class='img-thumbnail mx-auto' src='./images/glyphicons-pages.png'></a></h3></div></div>";

                            var helper = $(ww.helper);
                            var position = helper.position();
                            position.left -= canvas.position().left;
                            var node = {
                                position: position,
                                _id: (new Date()).getTime()
                            };
                            if (helper.hasClass('page')) {
                                node.type = 'PAGE';
                            } else if (helper.hasClass('action')) {
                                node.type = 'ACTION';
                            } else if (helper.hasClass('conditional')) {
                                node.type = 'CONDITIONAL';
                            } else {
                                return;
                            }
                            FlowDiagramService.addNode(node);
                            renderDiagram(canvas,pageHtml);
                        });

                }
            });
        }

        function renderDiagram(canvas,pageHtml) {
            canvas.empty();
            PageService
                .findPagesForWebsite(websiteId)
                .success(function(pages){
                    for(var p in pages) {
                        var html = pageHtml.replace(/PAGE_ID/g, pages[p]._id);
                        $(html)
                            .css({
                                position: 'absolute',
                                top: pages[p].y,
                                left: pages[p].x
                            })
                            .appendTo(canvas);
                    }
                });
        }
        return {
            restrict: 'EA',
            link: link,
            controller: 'FlowController'
        };
    }

    function wamFilter() {
        function linker(scope, element, attributes) {
            scope.comparators = [
                {label: '='},
                {label: '>'},
                {label: '>='},
                {label: '<'},
                {label: '<='}
            ];
        }
        return {
            templateUrl: '/directives/templates/wamFilter.html',
            link: linker,
            scope: {
                filters: '=',
                variables: '='
            }
        }
    }

    function jgaSortable() {
        function link(scope, element, attrs) {
            var start = null;
            var end   = null;
            $(element)
                .sortable({
                    sort: function(event, ui) {
                        //ui.helper.find("a").hide();
                        start = ui.item.index();
                    },
                    stop: function(event, ui) {
                        //ui.item.find("a").show();
                        end = ui.item.index();
                        if(start >= end) {
                            start--;
                        }
                        scope.jgaSortableCallback({start: start, end: end});
                    }
                });
        }
        return {
            scope: {
                jgaSortableCallback: '&'
            },
            link: link
        };
    }
})();