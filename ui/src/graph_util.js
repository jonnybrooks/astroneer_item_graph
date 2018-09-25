/*
* Graph utility functions
* */
export var GraphUtil;
(function (GraphUtil) {
    /*
    * Define the graph defaults
    * */
    GraphUtil.defaultLayout = {
        name: "cose-bilkent",
        animate: false,
        spacingFactor: 5
    };
    const defaultStyle = [
        {
            selector: "node",
            style: {
                height: 15,
                width: 15,
                "background-color": "data(colour)",
                label: "data(label)",
                "font-family": "Roboto, Helvetica, Arial, sans-serif",
                "font-weight": "500",
                "text-background-opacity": 0.5,
                "text-background-color": "white",
                "text-background-padding": "5px"
            }
        },
        {
            selector: ".selected",
            style: {
                "text-background-opacity": 0.6,
                "text-background-color": "yellow",
                "text-background-padding": "5px"
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "bezier",
                "width": 3,
                "opacity": 0.8,
                "target-arrow-shape": "triangle",
                "target-arrow-color": "data(colour)",
                "line-color": "data(colour)",
                label: "data(label)"
            }
        }
    ];
    /*
    * Generate config object for cytoscape's rendering engine
    * */
    function generateCytoConfig(container, graph) {
        return {
            container: container,
            boxSelectionEnabled: false,
            autounselectify: true,
            layout: GraphUtil.defaultLayout,
            style: defaultStyle,
            elements: graph
        };
    }
    GraphUtil.generateCytoConfig = generateCytoConfig;
    /*
    * Configuration and functions for creating new graph elements
    * */
    const cytoscapeBaseConf = {
        data: null,
        position: null,
        group: "",
        removed: false,
        selected: false,
        selectable: true,
        locked: false,
        grabbable: true,
        classes: "",
    };
    function createNode(data) {
        // build the node config object for cytoscape
        const nodeConf = { data, position: { x: 0, y: 0 }, group: "nodes", classes: data.tags.join(" ") };
        return Object.assign({}, cytoscapeBaseConf, nodeConf);
    }
    GraphUtil.createNode = createNode;
    function createEdge(data) {
        const edgeConf = { data, position: {}, group: "edges" };
        return Object.assign({}, cytoscapeBaseConf, edgeConf);
    }
    GraphUtil.createEdge = createEdge;
    function addTag(node, tag, val) {
        node.tags.push(tag);
        node.tag_map[tag] = val;
    }
    GraphUtil.addTag = addTag;
})(GraphUtil || (GraphUtil = {}));
//# sourceMappingURL=graph_util.js.map