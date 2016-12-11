module.exports = function() {

    var mongoose = require("mongoose");
    var mongojs  = require('mongojs');

    var connectionString = 'mongodb://127.0.0.1:27017/wam';
    var dbName = process.env.OPENSHIFT_APP_NAME || 'wam';

    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }

    mongoose.connect(connectionString);
    var mongo = mongojs(connectionString);

    var model = {};

    var developerModel   = require("./developer/developer.model.server")(model);
    var websiteModel     = require("./website/website.model.server")(model);
    var shareModel       = require("./website/share.model.server")(websiteModel);
    var pageModel        = require("./page/page.model.server")(websiteModel);
    var widgetModel      = require("./widget/widget.model.server")(model);
    var scriptModel      = require("./script/script.model.server")(websiteModel);
    var statementModel   = require("./statement/statement.model.server")(model);
    var imageGalleryModel= require("./imageGallery/image.gallery.model.server")(model);
    var flowModel        = require("./flow/flow.model.server")();
    var nodeModel        = require("./flow/node.model.server")();
    var connectionModel  = require("./flow/connection.model.server")();
    model.websiteModel   = websiteModel;
    model.shareModel     = shareModel;
    model.pageModel      = pageModel;
    model.widgetModel    = widgetModel;
    model.developerModel = developerModel;
    model.scriptModel    = scriptModel;
    model.statementModel = statementModel;
    model.imageGalleryModel=imageGalleryModel;
    model.flowModel      = flowModel;
    model.nodeModel      = nodeModel;
    model.connectionModel= connectionModel;
    model.mongo          = mongo;

    return model;
};