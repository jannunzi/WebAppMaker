(function () {
    angular
        .module ("WebAppMakerApp")
        .config (Configure);

    function Configure ($routeProvider, $httpProvider) {
        $httpProvider
            .defaults
            .headers
            .post = {
            'Content-Type': 'application/json'
        };
        $httpProvider
            .defaults
            .headers
            .put = {
            'Content-Type': 'application/json'
        };
        $routeProvider
            // authentication routes
            .when ("/", {
                templateUrl: "views/developer/login.view.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when ("/register", {
                templateUrl: "views/developer/register.view.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            // developer routes
            // .when ("/developer", {
            //     templateUrl: "views/developer/developer-list.view.html",
            //     controller: "DeveloperListController",
            //     controllerAs: "model",
            //     resolve: { loggedin: checkLoggedin }
            // })
            .when ("/developer/new", {
                templateUrl: "views/developer/developer-new.view.html",
                controller: "NewDeveloperController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer", {
                templateUrl: "views/developer/developer-edit.view.html",
                controller: "EditDeveloperController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId", {
                templateUrl: "views/developer/developer-edit.view.html",
                controller: "EditDeveloperController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            // .when ("/profile", {
            //     templateUrl: "views/developer/developer-edit.view.html",
            //     controller: "EditDeveloperController",
            //     controllerAs: "model",
            //     resolve: { loggedin: checkLoggedin }
            // })

            // website routes
            .when ("/developer/:developerId/website", {
                templateUrl: "views/website/website-list.view.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/new", {
                templateUrl: "views/website/website-new.view.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId", {
                templateUrl: "views/website/website-edit.view.html",
                controller: "EditWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            // .when ("/developer/:developerId/website/:websiteId/edit", {
            //     templateUrl: "views/website/website-edit.view.html",
            //     controller: "EditWebsiteController",
            //     controllerAs: "model",
            //     resolve: { loggedin: checkLoggedin }
            // })
            .when ("/developer/:developerId/website/:websiteId/share", {
                templateUrl: "views/website/website-share.view.html",
                controller: "ShareWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            // page routes
            // .when ("/developer/:username/website/:websiteId/page", {
            .when ("/developer/:developerId/website/:websiteId/page", {
                templateUrl: "views/page/page-list.view.html",
                controller: "PageListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId/flow", {
                templateUrl: "views/flow/flow.view.client.html",
                controller: "FlowController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })

            .when ("/developer/:developerId/website/:websiteId/flow/123/page/new", {
                templateUrl: "views/flow/page/page-new.view.html",
                controller: "FlowController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })

            .when ("/developer/:developerId/website/:websiteId/page/new", {
                templateUrl: "views/page/page-new.view.html",
                controller: "NewPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId/page/:pageId", {
                templateUrl: "views/page/page-edit.view.html",
                controller: "EditPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })

            // widget routes
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/widget", {
                templateUrl: "views/widget/widget-landscape.view.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:username/website/:websiteId/page/:pageId/run", {
                templateUrl: "views/page/page-run.view.html",
                controller: "PageRunController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:username/website/:websiteId/page/:pageId/preview", {
                templateUrl: "views/widget/page-preview.view.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/choose-widget", {
                templateUrl: "views/widget/widget-choose.view.html",
                controller: "ChooseWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId", {
                templateUrl: "views/widget/widget-edit.view.html",
                controller: "WidgetEditController",
                controllerAs: "model"
            })
            .when ("/developer/:username/website/:websiteId/page/:pageId/widget/:widgetId/flickr", {
                templateUrl: "views/widget/flickr/widget-image-search.view.client.html",
                controller: "FlickrSearchController",
                controllerAs: "model"
            })
            .when ("/widget/:widgetId/flickr", {
                templateUrl: "views/widget/flickr/widget-image-search.view.client.html",
                controller: "FlickrSearchController",
                controllerAs: "model"
            })
            .when("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/image/new",{
                templateUrl: "views/widget/flickr/image-gallery-add-image.view.client.html",
                controller: "AddNewImageController",
                controllerAs: "model"

            })
            .when("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/image",{
                templateUrl: "views/widget/flickr/image.gallery.search.view.html",
                controller: "ImageGalleryController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/google",{
            templateUrl: "views/widget/flickr/widget-google-image-search.view.client.html",
            controller: "GoogleSearchController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        })
            // script routes
            // .when ("/developer/:username/website/:websiteId/page/:pageId/widget/:widgetId/script", {
            //     templateUrl: "views/script/script-list.view.html",
            //     controller: "ScriptListController",
            //     controllerAs: "model",
            //     resolve: { loggedin: checkLoggedin }
            // })
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/script/new", {
                templateUrl: "views/script/script-new.view.html",
                controller: "NewScriptController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/script", {
                templateUrl: "views/script/script-edit.view.html",
                controller: "EditScriptController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            // navigate to statement editor when you click on th cog
            .when ("/developer/:developerId/website/:websiteId/page/:pageId/widget/:widgetId/script/:scriptId/statement/:statementId", {
                templateUrl: "views/statement/statement-edit.view.html",
                controller: "EditStatementController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .otherwise ({
                redirectTo: "/"
            });
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.error = 'You need to log in.';
                deferred.reject();
                $location.url('/');
            }
        });

        return deferred.promise;
    };
})();