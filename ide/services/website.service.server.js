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
                  console.log(response.result);
                    //res.json(response.result);
                    res.json({});
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function removeWebsite (req, res) {
        console.log("Remove");
        var websiteId = req.params.websiteId;
        websiteModel
            .removeWebsite(websiteId)
            .then(
                function(response) {
                    console.log("Here ", response);
                    res.header("Access-Control-Allow-Origin", "*").json({});
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findWebsiteById (req, res) {
        console.log("Find website by ID");
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.header("Access-Control-Allow-Origin", "*").json(website);
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
                    res.header("Access-Control-Allow-Origin", "*").json(developer.websites);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function createWebsite (req, res) {
        console.log("Create website");
        var developerId = req.params.developerId;
        var website = req.body;
        console.log("Create website " , developerId);
        console.log("Website To Save " , website);
        websiteModel
            .createWebsite (website)
            .then (
                function (website) {
                    console.log("The Website to return : " , website);
                    res.header("Access-Control-Allow-Origin", "*").json(website);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }
}
