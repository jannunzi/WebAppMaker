var mongoose = require("mongoose");
var q = require("q");

module.exports = function (model) {

    var WebsiteSchema = require("./website.schema.server.js")();
    var Website = mongoose.model("Website", WebsiteSchema);

    var api = {
        createWebsite: createWebsite,
        findWebsitesForDeveloperId: findWebsitesForDeveloperId,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        removeWebsite: removeWebsite,
        getMongooseModel: getMongooseModel
    };
    return api;

    function getMongooseModel() {
        return Website;
    }

    function updateWebsite(websiteId, website) {
        delete website._id
        return Website.update(
            {_id: websiteId},
            {$set: website}
        );
    }

    function removeWebsite(websiteId) {
        return Website.remove().where("_id").equals(websiteId);
    }

    function findWebsiteById (websiteId) {
        return Website.findById (websiteId);
    }

    function findWebsitesForDeveloperId (developerId) {
        return model.developerModel.findDeveloperById(developerId);
        // var deferred = q.defer();
        // Website
        //     .find(
        //         {_developer: developerId},
        //         '_id dateCreated developerUsername name',
        //         function (err, websites) {
        //             websites
        //                 .populate("_developer", "username")
        //                 .exex(function(err, websites){
        //                     if (!err) {
        //                         deferred.resolve (websites);
        //                     } else {
        //                         deferred.reject (err);
        //                     }
        //                 });
        //         }
        //     );
        // return deferred.promise;
    }

    function createWebsite (website) {
        var website =  Website.create (website)
            .then(
                function(website) {
                    model.developerModel
                        .findDeveloperById(website._developer)
                        .update({$pushAll: {websites: [website._id]}})
                        .then(
                            function(stat) {
                                console.log(stat);
                            },
                            function(error) {
                                console.log(error);
                            }
                        )
                },
                function(error) {
                    console.log(error);
                }
            );

            console.log("Create website in model ", website);
            return website;
    }
};
