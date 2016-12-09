module.exports = function(app, model) {
    app.get("/user/:uid/website/:wid/flow", getFlowDiagram);
    app.get("/user/:uid/website/:wid/flow/:fid/node", getNodeForFlow);
    app.get("/user/:uid/website/:wid/flow/:fid/node/:nid", getNodeById);
    app.get("/user/:uid/website/:wid/flow/:fid/connection", getConnectionForFlow);


    function getNodeForFlow(req, res) {
        var userId = req.params.uid;
        var websiteId = req.params.wid;
        var flowId = req.params.fid;

        model
            .nodeModel
            .getNodeForFlow(userId, websiteId, flowId)
            .then(
                function(nodes) {
                    res.json(nodes);
                },
                function(error) {
                    res.statusCode(400).send(error);
                }
            );
    }

    function getConnectionForFlow(req, res) {
        var userId = req.params.uid;
        var websiteId = req.params.wid;
        var flowId = req.params.fid;

        model
            .connectionModel
            .getConnectionForFlow(userId, websiteId, flowId)
            .then(
                function(connections) {
                    res.json(connections);
                },
                function(error) {
                    res.statusCode(400).send(error);
                }
            );
    }


    function getFlowDiagram(req, res) {
        var userId = req.params.uid;
        var websiteId = req.params.wid;

        model
            .flowModel
            .getFlowDiagram(userId, websiteId)
            .then(
                function(diagram) {
                    res.json(diagram);
                },
                function(error) {
                    res.statusCode(400).send(error);
                }
            );
    }

// These are mongo commonds to insert sample flow, nodes and connections

//         db.flow.insert({_id: "5843abda1f0a92ccd7f1ced3",
//        _developer:ObjectId("581e32c9c247e43b7c09dac4"),
//    _website:ObjectId("581e33f2c247e43b7c09dac5"),
//         nodes:[ObjectId("581e33f2c247e43b7c09d123"), ObjectId("581e33f2c247e43b7c09d223"), ObjectId("581e33f2c247e43b7c09d323"),
//             ObjectId("581e33f2c247e43b7c09d423"), ObjectId("581e33f2c247e43b7c09d523")
// ],
//     connections:[ObjectId("681e32c9c247e43b7c09d123"), ObjectId("681e32c9c247e43b7c09d234"), ObjectId("681e32c9c247e43b7c09d456")
//     ]
//
// });


    // db.node.insert(
    //         [
    //             {_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),_id: "581e33f2c247e43b7c09d123", x: 50, y: 50, type: 'PAGE', name: 'Page 1'},
    //             {_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),_id: "581e33f2c247e43b7c09d223", x: 600, y: 50, type: 'ACTION', name: 'Page 2'},
    //             {_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),_id: "581e33f2c247e43b7c09d323", x: 50, y: 500, type: 'PAGE', name: 'Page 3'},
    //             {_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),_id: "581e33f2c247e43b7c09d423", x: 600, y: 500, type: 'CONDITIONAL', name: 'Page 4'},
    //             {_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),_id: "581e33f2c247e43b7c09d523", x: 325, y: 325, type: 'PAGE', name: 'Page 5'}
    //         ]
    //     );

    // db.connection.insert(
    //     [
    //         {_id:"681e32c9c247e43b7c09d123",_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),from: "581e33f2c247e43b7c09d123", to: "581e33f2c247e43b7c09d223"},
    //         {_id:"681e32c9c247e43b7c09d234",_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),from: "581e33f2c247e43b7c09d223", to: "581e33f2c247e43b7c09d323"},
    //         {_id:"681e32c9c247e43b7c09d456",_flow: ObjectId("5843abda1f0a92ccd7f1ced3"),from: "581e33f2c247e43b7c09d423", to: "581e33f2c247e43b7c09d523"}
    //     ]
    // );

    //     db.flow.insert({
//         _developer:ObjectId("581e32c9c247e43b7c09dac4"),
//         _website:ObjectId("581e33f2c247e43b7c09dac5"),
//         nodes:[
//     {_id: 123, x: 50, y: 50, type: 'PAGE', name: 'Page 1'},
//     {_id: 223, x: 600, y: 50, type: 'ACTION', name: 'Page 2'},
//     {_id: 323, x: 50, y: 500, type: 'PAGE', name: 'Page 3'},
//     {_id: 423, x: 600, y: 500, type: 'CONDITIONAL', name: 'Page 4'},
//     {_id: 523, x: 325, y: 325, type: 'PAGE', name: 'Page 5'}
// ],
//     connections:[
//         {from: 123, to: 223},
//         {from: 223, to: 323},
//         {from: 423, to: 523}
//     ]
//
// });


    function getNodeById(req, res) {
        var userId = req.params.uid;
        var websiteId = req.params.wid;
        var flowId = req.params.fid;
        var nodeId = req.params.nid;

        model
            .nodeModel
            .getNodeById(nodeId)
            .then(
                function(node) {
                    res.json(node);
                },
                function(error) {
                    res.statusCode(400).send(error);
                }
            );
    }




};