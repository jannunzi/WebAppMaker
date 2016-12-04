(function(){
    angular
        .module("WebAppMakerApp")
        .controller("EditStatementController", EditStatementController)
        .controller("ChooseStatementController", ChooseStatementController)
        .controller("EditScriptController", EditScriptController)
        .controller("NewScriptController", NewScriptController)
        .controller("ScriptListController", ScriptListController);

    // controller for the statement editor
    function EditStatementController($routeParams, PageService, ScriptService, WidgetService, $location, $scope) {

        var vm = this;

        vm.statementId = $routeParams.statementId;

        vm.statementTypes = [
            {label: 'Numeric'},
            {label: 'String'},
            {label: 'Boolean'},
            {label: 'If'},
            {label: 'Navigation'},
            {label: 'Date'},
            {label: 'Database'}
        ];
        vm.statementType = vm.statementTypes[5];

        vm.databaseOperations = [
            {label: 'Select'},
            {label: 'Insert'},
            {label: 'Update'},
            {label: 'Delete'}
        ];
        vm.databaseOperation = vm.databaseOperations[0];

        vm.dateOperations = [
            {label: 'Create From String'},
            {label: 'Get Date'},
            {label: 'Get Day'},
            {label: 'Get Full Year'},
            {label: 'Get Hours'}
        ];
        vm.dateOperation = vm.dateOperations[0];

        vm.collections = [
            {label: 'Collection 1'},
            {label: 'Collection 2'},
            {label: 'Collection 3'}
        ];

        vm.variables = [
            {label: 'Var 1'},
            {label: 'Var 2'},
            {label: 'Var 3'}
        ];

        vm.comparators = [
            {label: '=='},
            {label: '!='},
            {label: '>'},
            {label: '>='},
            {label: '<'},
            {label: '<='}
        ];

        vm.verboseComparators = [
            {label: 'Equal to'},
            {label: 'NOT Equal'},
            {label: 'Greater than'},
            {label: 'Greater than or equal'},
            {label: 'Less than'},
            {label: 'Less than or equal'}
        ];

        vm.ifThen = [
            {label: 'Go to statement'},
            {label: 'Navigate to page'}
        ];

        // route params
        vm.username    = $routeParams.username;
        vm.developerId = $routeParams.developerId;
        vm.websiteId   = $routeParams.websiteId;
        vm.pageId      = $routeParams.pageId;
        vm.widgetId    = $routeParams.widgetId;
        vm.statementId = $routeParams.statementId;

        // event handlers
        vm.updateStatement = updateStatement;
        vm.deleteStatement = deleteStatement;

        // retrieve statement on load
        function init() {
            WidgetService
                .findWidgetsForWebsite(vm.websiteId)
                .then(
                    function(response) {
                        vm.widgets = response.data;
                        return PageService
                            .findPagesForWebsite(vm.websiteId);
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
                .then(
                    function(response) {
                        vm.pages = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
            ScriptService
                .findStatement(vm)
                .then(
                    function(response) {
                        vm.statement = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function deleteStatement() {
            ScriptService
                .deleteStatement(vm)
                .then(
                    function() {
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId+"/script/edit");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

        function updateStatement() {
            console.log(vm.statement);
            ScriptService
                .updateStatement(vm, vm.statement)
                .then(
                    function() {
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId+"/script/edit");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

    function ChooseStatementController($routeParams, ScriptService, $location) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        vm.selectStatement = selectStatement;

        // handle statement type selection
        function selectStatement(statementType) {
            // notify Web service of new statement
            ScriptService
                .addStatement(vm, statementType)
                .then(
                    function(response) {
                        var statements = response.data.button.script.statements;
                        var lastStatement = statements[statements.length - 1];
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/" + vm.widgetId + "/script/statement/" + lastStatement._id);
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

    }

    function EditScriptController($routeParams, ScriptService, StatementService, $location) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        // event handlers
        vm.saveScriptAndExecStatement = saveScriptAndExecStatement;
        vm.saveScript      = saveScript;
        function init() {
            ScriptService
                .findScript(vm)
                .then(
                    function(response) {
                        vm.script = response.data;
                        if(!vm.script || vm.script == 'null') {
                            vm.script = {};
                        }
                            //AW: If script is present below action is executed
                        else {
                            vm.scriptId = vm.script._id;
                            StatementService
                                .findAllStatements(vm)
                                .then(
                                    function (response) {
                                        vm.statements = response.data;
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
        init();

        function saveScript(script) {
            ScriptService
                .saveScript(vm, script)
                .then(
                    function(script){
                        var url  = "/developer/" + vm.developerId;
                            url += "/website/" + vm.websiteId;
                            url += "/page/" + vm.pageId;
                            url += "/widget/" + vm.widgetId;
                        $location.url(url);
                    },
                    function(err){
                        vm.error = err;
                    }
                );
        }

        function newSaveScript(script) {
            vm.script.name = 'UntitledScript';
            ScriptService
                .saveScript(vm, script)
                .then(
                    function(script){
                        ScriptService
                            .findScript(vm)
                            .then(
                                function(response) {
                                    vm.script = response.data;
                                    if(!vm.script || vm.script == 'null') {
                                        vm.script = {};
                                    }
                                    //AW: If script is present below action is executed
                                    else {
                                        vm.scriptId = vm.script._id;
                                    }
                                    var url  = "/developer/" + vm.developerId;
                                    url += "/website/" + vm.websiteId;
                                    url += "/page/" + vm.pageId;
                                    url += "/widget/" + vm.widgetId;
                                    url += "/script/" + vm.script._id;
                                    url += "/statement/new";
                                    $location.url(url);
                                },
                                function(err) {
                                    vm.error = err;
                                }
                            );
                    },
                    function(err){
                        vm.error = err;
                    }
                );
        }

        function saveScriptAndExecStatement(script) {
            if(script._id === undefined){
                newSaveScript(script);
            }else{
                ScriptService
                    .findScript(vm)
                    .then(
                        function(response) {
                            vm.script = response.data;
                            if(!vm.script || vm.script == 'null') {
                                vm.script = {};
                            }
                            //AW: If script is present below action is executed
                            else {
                                vm.scriptId = vm.script._id;
                                StatementService
                                    .findAllStatements(vm)
                                    .then(
                                        function (response) {
                                            vm.statements = response.data;
                                        },
                                        function (err) {
                                            vm.error = err;
                                        }
                                    );
                            }
                            var url  = "/developer/" + vm.developerId;
                            url += "/website/" + vm.websiteId;
                            url += "/page/" + vm.pageId;
                            url += "/widget/" + vm.widgetId;
                            url += "/script/" + vm.script._id;
                            url += "/statement/new";
                            $location.url(url);
                        },
                        function(err) {
                            vm.error = err;
                        }
                    );
            }
        }
    }

    function NewScriptController($location, $routeParams, ScriptService) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        // event handlers
        vm.createScript  = createScript;

        function init() {

        }
        init();

        function createScript(script) {
            ScriptService
                .createScript(vm, script)
                .then(
                    function(response){
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId);
                    },
                    function(error){
                        vm.error = error;
                    }
                )
        }
    }

    function ScriptListController($routeParams) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        function init() {

        }
        init();
    }
})();