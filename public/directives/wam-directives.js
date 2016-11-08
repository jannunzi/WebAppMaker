(function () {
    angular
        .module("wamDirectives", [])
        .directive("wamFilter", wamFilter)
        .directive("jgaDraggable", jgaDraggable)
        .directive("jgaDroppable", jgaDroppable);

    var websiteId;

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

    function jgaDroppable(FlowDiagramService, PageService) {
        var pageHtml;
        console.log(PageService);
        var actionHtml = "<h3 class='node'>Action</h3>";
        var conditionalHtml = "<h3 class='node'>Conditional</h3>";
        function link(scope, element, attributes) {

            var model123 = scope.model,
                developerId = model123.developerId,
                pageId = model123.pageId,
                url = '#/developer/' + developerId + '/website/' + websiteId + '/flow/123/page/'+ pageId;

            websiteId = model123.websiteId;

            pageHtml = "<h3 class='node'><a href=" + url + "><span class='glyphicon glyphicon-plus'></span></a></h3>";

            var newPage = {name : "New Page", title : "default"};
            console.log("jgaDroppable");
            console.log([scope, element, attributes]);
            var canvas = element;
            renderDiagram(canvas);
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
                            console.log(page);
                            url = '#/developer/' + developerId + '/website/' + websiteId + '/flow/123/page/'+ page.data._id;
                            pageHtml = "<h3 class='node'><a href=" + url + "><span class='glyphicon glyphicon-plus'></span></a></h3>";

                            // var newNode = {type: 'PAGE'};
                            // FlowDiagramService.addNode(newNode);
                            // console.log(FlowDiagramService.getDiagram());
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
                            renderDiagram(canvas);
                        });
                }
            });
        }

        function renderDiagram(canvas) {

            PageService
                .findPagesForWebsite(websiteId)
                .success(function(pages){
                    for(var p in pages) {
                        $(pageHtml)
                            .css({
                                position: 'absolute',
                                top: pages[p].y,
                                left: pages[p].x
                            })
                            .appendTo(canvas);
                    }
                });

            var diagram = FlowDiagramService.getDiagram();
            canvas.empty();
            for(var d in diagram) {
                var node = diagram[d];
                var newNode = {};
                if(node.type === 'PAGE') {
                    newNode = $(pageHtml);
                } else if(node.type === 'ACTION') {
                    newNode = $(actionHtml);
                } else if(node.type === 'CONDITIONAL') {
                    newNode = $(conditionalHtml);
                }
                newNode.css({
                    "position": "absolute",
                    "top": node.position.top,
                    "left": node.position.left,
                }).draggable({
                    containment: "parent",
                    stop: function(event, ui){
                        var id = ui.helper.attr("id");
                        for(var d in diagram) {
                            var node = diagram[d];
                            if(node._id == id) {
                                node.position.left = ui.position.left;
                                node.position.top = ui.position.top;
                            }
                        }
                    }
                }).attr("id", node._id);
                canvas.append(newNode);
            }
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
})();