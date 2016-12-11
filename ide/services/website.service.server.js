var mongoose = require("mongoose");

module.exports = function (app, model) {

    var websiteModel = model.websiteModel;

    app.post   ("/api/developer/:developerId/website", createWebsite);
    app.get    ("/api/developer/:developerId/website", findWebsitesForDeveloperId);
    app.get    ("/api/website/:websiteId", findWebsiteById);
    app.delete ("/api/website/:websiteId", removeWebsite);
    app.put    ("/api/website/:websiteId", updateWebsite);

    function updateWebsite (req, res) {
        var website = req.body;
        var websiteId = req.params.websiteId;
        websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function(response) {
                    res.json(response.result);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function removeWebsite (req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .removeWebsite(websiteId)
            .then(
                function(response) {
                    res.json(response.result);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findWebsiteById (req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findWebsitesForDeveloperId (req, res) {
        var developerId = req.params.developerId;
        websiteModel
            .findWebsitesForDeveloperId (developerId)
            .then (
                function (developer) {
                    res.json (developer.websites);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function createWebsite (req, res) {
        var developerId = req.params.developerId;
        var website = req.body;
        websiteModel
            .createWebsite (website)
            .then (
                function (website) {
                    res.json (website);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }
};