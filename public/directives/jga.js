(function(){
    angular
        .module("jga", [])
        .directive("jgaDraggable", jgaDraggable)
        .directive("jgaDroppable", jgaDroppable);

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
            link: link
        };
    }

    function jgaDroppable(FlowDiagramService) {
        var pageHtml = "<h3 class='node'>Page</h3>";
        var actionHtml = "<h3 class='node'>Action</h3>";
        var conditionalHtml = "<h3 class='node'>Conditional</h3>";
        function link(scope, element, attributes) {
            console.log("jgaDroppable");
            console.log([scope, element, attributes]);
            var canvas = element;
            canvas.droppable({
                drop: function(qq, ww){
                    console.log("dropped");
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
                }
            });
        }
        function renderDiagram(canvas) {
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
            link: link
        };
    }
})();