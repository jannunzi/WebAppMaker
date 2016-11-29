(function () {
    angular
        .module ("WebAppMakerApp")
        .controller ("WidgetListController", widgetListController)
        .controller ("WidgetEditController", widgetEditController)
        .controller ("ChooseWidgetController", chooseWidgetController);

    function widgetEditController($routeParams, WidgetService, $location, PageService) {

        var vm = this;
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        vm.updateWidget  = updateWidget;
        vm.removeWidget  = removeWidget;
        vm.changeWidget =changeWidget;
        function init() {
            PageService
                .findPagesForWebsite(vm.websiteId)
                .then(
                    function(response) {
                        vm.pages = response.data;
                        return WidgetService
                            .findWidgetById(vm.websiteId, vm.pageId, vm.widgetId);
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
                .then(
                    function(response){
                        vm.widget = response.data;
                    },
                    function(error){
                        vm.error = err;
                    }
                );
        }
        init();

        function removeWidget(widget) {
            WidgetService
                .removeWidget(vm.websiteId, vm.pageId, vm.widgetId)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.widget._page+"/widget");
                    },
                    function(error) {
                        vm.error = error;
                    }
                );
        }

        function updateWidget(widget) {
            WidgetService
                .updateWidget(vm.websiteId, vm.pageId, vm.widgetId, widget)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+widget._page+"/widget");
                    },
                    function(error) {
                        vm.error = error;
                    }
                );
        }
        function changeWidget(widget)
        {
            $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/" + vm.widgetId+"/image");
        }
    }

    function widgetListController ($routeParams, PageService, WidgetService, ScriptService, StatementService, $sce) {

        var vm = this;
        vm.username       = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId      = $routeParams.websiteId;
        vm.pageId         = $routeParams.pageId;
        vm.viewType = 'list';

        vm.safeYouTubeUrl = safeYouTubeUrl;
        vm.getButtonClass = getButtonClass;
        vm.sortWidget     = sortWidget;
        vm.trustAsHtml    = trustAsHtml;
        vm.toggleView    = toggleView;
        vm.runScript     = runScript;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                        return WidgetService.getWidgets(vm.websiteId, vm.pageId);
                    },
                    function(error) {
                        vm.error = error;
                    }
                )
                .then(
                    function(response) {
                        vm.widgets = response.data;
                        //console.log(vm.widgets);
                        //runScript(vm.widgets[0]._id);
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function trustAsHtml(html) {
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

        function sortWidget(start, end) {
            WidgetService
                .sortWidget(vm.websiteId, vm.pageId, start, end)
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

        function runScript(widgetId){
            var model = Object.create(vm);
            model.widgetId = widgetId;
            ScriptService
                .findScript(model)
                .then(
                    function(response) {
                        model.script = response.data;
                        console.log(model.script);
                        if(!model.script || model.script == 'null') {
                            model.script = {};
                        }
                        //AW: If script is present below action is executed
                        else {
                            model.scriptId = model.script._id;
                            StatementService
                                .findAllStatements(model)
                                .then(
                                    function (response) {
                                        model.statements = response.data;
                                        console.log(model.statements);

                                        for(var i = 0 ; i < model.statements.length; ++i) {
                                            var statement = model.statements[i];
                                            if ("STRING" === statement.statementType) {
                                                var srtingStatement = statement.stringStatement;
                                                if ("SUBSTRING" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var startWidget;
                                                    var endWidget;
                                                    var outputWidget;


                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.start) {
                                                            startWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.end) {
                                                            endWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }


                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;

                                                    var endString;
                                                    if (endWidget)
                                                        endString = endWidget.text;
                                                    else
                                                        endString = statement.length;

                                                    var startString;
                                                    if (startWidget)
                                                        startString = startWidget.text;
                                                    else
                                                        startString = statement.start;

                                                    var outputString = inputString.substring(startString, endString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if ("LENGTH" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }
                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;

                                                    var outputString = inputString.length;

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("CONCATENATE" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var input2Widget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.input2) {
                                                            input2Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var input2String;
                                                    if (input2Widget)
                                                        input2String = input2Widget.text;
                                                    else
                                                        input2String = statement.input2;

                                                    var outputString = input1String.concat(input2String);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("CHARAT" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var indexWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.index) {
                                                            indexWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var indexString;
                                                    if (indexWidget)
                                                        indexString = indexWidget.text;
                                                    else
                                                        indexString = statement.index;

                                                    var outputString = input1String.charAt(indexString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                }
                                                else if ("INDEXOF" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var startWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.start) {
                                                            startWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;

                                                    var startString;
                                                    if (startWidget)
                                                        startString = startWidget.text;
                                                    else
                                                        startString = statement.start;

                                                    if ("" === startString)
                                                        startString = 0;

                                                    var outputString = input1String.indexOf(searchString, startString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("LASTINDEXOF" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var startWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.start) {
                                                            startWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;

                                                    var startString;
                                                    if (startWidget)
                                                        startString = startWidget.text;
                                                    else
                                                        startString = statement.start;

                                                    if ("" === startString)
                                                        startString = input1String.length;

                                                    var outputString = input1String.lastIndexOf(searchString, startString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("SEARCH" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }


                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;


                                                    var outputString = input1String.search(searchString, startString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("REPEAT" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var countWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.count) {
                                                            countWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var countString;
                                                    if (countWidget)
                                                        countString = countWidget.text;
                                                    else
                                                        countString = statement.index;

                                                    var outputString = input1String.repeat(countString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                }
                                                else if ("REPLACE" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var newValueWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.newvalue) {
                                                            newValueWidget = widget;
                                                            continue;
                                                        }


                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;

                                                    var newValueString;
                                                    if (newValueWidget)
                                                        newValueString = newValueWidget.text;
                                                    else
                                                        newValueString = statement.searchvalue;


                                                    var outputString = input1String.replace(searchString, newValueString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("SLICE" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var startWidget;
                                                    var endWidget;
                                                    var outputWidget;


                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.start) {
                                                            startWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.end) {
                                                            endWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }


                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;

                                                    var endString;
                                                    if (endWidget)
                                                        endString = endWidget.text;
                                                    else
                                                        endString = statement.length;

                                                    var startString;
                                                    if (startWidget)
                                                        startString = startWidget.text;
                                                    else
                                                        startString = statement.start;

                                                    var outputString = inputString.slice(startString, endString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if ("LOWERCASE" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var outputWidget;


                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }


                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;


                                                    var outputString = inputString.toLowerCase();

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if ("UPPERCASE" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var outputWidget;


                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }


                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;


                                                    var outputString = inputString.toUpperCase();

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if ("TRIM" === statement.stringStatement.operationType) {
                                                    var inputWidget;
                                                    var outputWidget;


                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            inputWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                            continue;
                                                        }


                                                    }

                                                    var inputString;
                                                    if (inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;


                                                    var outputString = inputString.trim();

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if ("STARTSWITH" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var startWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.start) {
                                                            startWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;

                                                    var startString;
                                                    if (startWidget)
                                                        startString = startWidget.text;
                                                    else
                                                        startString = statement.start;

                                                    if ("" === startString)
                                                        startString = 0;

                                                    var outputString = input1String.startsWith(searchString, startString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                                else if ("ENDSWITH" === statement.stringStatement.operationType) {
                                                    var input1Widget;
                                                    var searchWidget;
                                                    var lengthWidget;
                                                    var outputWidget;

                                                    for (var j = 0; j < vm.widgets.length; ++j) {
                                                        var widget = vm.widgets[j];
                                                        if (widget.name === srtingStatement.input1) {
                                                            input1Widget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.searchvalue) {
                                                            searchWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.length) {
                                                            lengthWidget = widget;
                                                            continue;
                                                        }

                                                        if (widget.name === srtingStatement.output) {
                                                            outputWidget = widget;
                                                        }

                                                    }

                                                    var input1String;
                                                    if (input1Widget)
                                                        input1String = input1Widget.text;
                                                    else
                                                        input1String = statement.input1;

                                                    var searchString;
                                                    if (searchWidget)
                                                        searchString = searchWidget.text;
                                                    else
                                                        searchString = statement.searchvalue;

                                                    var lengthString;
                                                    if (lengthWidget)
                                                        lengthString = lengthWidget.text;
                                                    else
                                                        lengthString = statement.start;

                                                    if ("" === lengthString)
                                                        startString = input1String.length;

                                                    var outputString = input1String.endsWith(searchString, lengthString);

                                                    if (outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                            }
                                        }

                                    },
                                    function (err) {
                                        vm.error = err;
                                    }
                                );
                        }
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

    }

    function chooseWidgetController ($routeParams, WidgetService, PageService, $location) {

        var vm = this;

        vm.username  = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId    = $routeParams.pageId;

        vm.selectWidget = selectWidget;

        function selectWidget(widgetType) {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                        //console.log("PAge");
                        //console.log(vm.page);
                        return WidgetService
                            .addWidget(vm.developerId,vm.page._website, vm.page._id, widgetType)
                    },
                    function(error) {
                        vm.error = error;
                    }
                )
                .then(
                    function(response) {
                        var newWidget = response.data;
                        console.log("imageWidget");
                        console.log(newWidget);
                       if(newWidget.widgetType==="IMAGE")
                        {
                            console.log("New Image");
                            console.log(vm.developerId);
                            $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.page._id+"/widget/" + newWidget._id+"/image");
                        }
                        else {
                           $location.url("/developer/" + vm.developerId + "/website/" + vm.websiteId + "/page/" + vm.page._id + "/widget/" + newWidget._id);
                       }
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

})();