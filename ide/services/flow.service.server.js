module.exports = function(app) {
    app.get("/user/:uid/website/:wid/flow", getFlowDiagram);

    var diagram = {
        nodes: [
            {_id: 123, x: 100, y: 100, type: 'PAGE', name: 'Page 1'},
            {_id: 223, x: 200, y: 200, type: 'ACTION', name: 'Page 2'},
            {_id: 323, x: 300, y: 300, type: 'PAGE', name: 'Page 3'},
            {_id: 423, x: 400, y: 400, type: 'CONDITIONAL', name: 'Page 4'},
            {_id: 523, x: 500, y: 500, type: 'PAGE', name: 'Page 5'}
        ],
        connections: [
            {from: 123, to: 223},
            {from: 223, to: 323},
            {from: 423, to: 523}
        ]
    };

    function getFlowDiagram(req, res) {
        res.json(diagram);
    }
};