module.exports = function (app, db) {

    var model = require("./models/model.js")();

    var flowDiagramService = require("./services/flow.service.server")(app, model);
    var developerService   = require("./services/developer.service.server.js")  (app, model);
    var websiteService = require("./services/website.service.server.js")(app, model);
    var pageService        = require("./services/page.service.server.js")       (app, model);
    var widgetService      = require("./services/widget.service.server.js")     (app, model);
    var scriptService      = require("./services/script.service.server.js")     (app, model);
    var statementService   = require("./services/statement.service.server.js")  (app, model);
    var shareService       = require("./services/share.service.server.js")      (app, model);
    var imageGalleryService= require("./services/imagegallery.service.server.js")(app,model);
    var flowModel        = require("./services/flow.service.server")(app, model);
    // pass express app and db connection to database service
    var databaseService = require("./services/database.service.server")(app, model);

    // load a server side controller to handle page routes,
    // provide data, and render templates 
    // pass model to the controller
    var controllers = require("./controllers/page.controller.server.js")(app, model);
};