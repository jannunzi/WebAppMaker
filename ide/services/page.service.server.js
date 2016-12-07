module.exports = function (app, model) {

    var pageModel   = model.pageModel;

    app.post   ("/api/website/:websiteId/page", createPage);
    app.get    ("/api/website/:websiteId/page", findPagesForWebsite);
    app.get    ("/api/website/:websiteId/page/:pageId", findPage);
    app.get    ("/api/page/:pageId", findPageById);
    app.delete ("/api/page/:pageId", removePage);
    app.put    ("/api/page/:pageId", updatePage);
    app.put    ("/api/website/:websiteId/page", updatePages);

    function findPageById(req, res) {
        var pageId = req.params.pageId;

        pageModel
            .findPageById(pageId)
            .then(
                function(page){
                    res.json(page);
                },
                function(error){
                    res.status(404).send(error);
                }
            );
    }

    function updatePages (req, res) {
        var websiteId = req.params.websiteId;
        var startIndex = req.query.startIndex;
        var endIndex = req.query.endIndex;

        if(startIndex && endIndex) {
            pageModel
                .sortPage(websiteId, startIndex, endIndex)
                .then(
                    function(stat) {
                        return res.json(200);
                    },
                    function(err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function updatePage (req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var page = req.body;
        pageModel
            .updatePage(pageId, page)
            .then(
                function(stat) {
                    console.log("Stattttttttttttttt ,", stat);
                    res.status(200).json({});
                },
                function(err) {
                    res.status(404).send(err);
                }
            );
    }

    function removePage (req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        pageModel
            .removePage(pageId)
            .then(
                function(stat) {
                    res.status(200).json({});
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
    }

    function findPage(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        pageModel
            .findPage(pageId)
            .then(
                function(page) {
                    res.json(page);
                },
                function(err) {
                    res.status(404).send(err);
                }
            );
    }

    function findPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        pageModel
            .findPagesForWebsite(websiteId)
            .then(
                function(pages) {
                    res.json(pages);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        pageModel
            .createPage(websiteId, page)
            .then(
                function(page) {
                    res.json(page);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }
}
