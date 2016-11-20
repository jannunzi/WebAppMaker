(function () {
    angular
        .module ("WebAppMakerApp")
        .factory ("PageService", pageService);

    function pageService ($http) {
        var api = {
            createPage: createPage,
            findPagesForWebsite: findPagesForWebsite,
            findPage: findPage,
            findPageById: findPageById,
            removePage: removePage,
            updatePage: updatePage,
            sortPage: sortPage,

        };
        return api;

        function sortPage(websiteId, startIndex, endIndex) {
            return $http.put("/api/website/"+websiteId+"/page?startIndex="+startIndex+"&endIndex="+endIndex);
        }

        function updatePage(pageId, page) {
            return $http.put("/api/page/"+pageId, page);
        }

        function removePage( pageId) {
            return $http.delete("/api/page/"+pageId);
        }


        function findPage(websiteId, pageId) {
            return $http.get("/api/website/"+websiteId+"/page/"+pageId);
        }

        function findPageById(pageId) {
            return $http.get("/api/page/"+pageId);
        }

        function findPagesForWebsite(websiteId) {
            return $http.get("/api/website/"+websiteId+"/page");
        }

        function createPage(websiteId, page) {
            return $http.post("/api/website/"+websiteId+"/page", page);
        }
    }
})();