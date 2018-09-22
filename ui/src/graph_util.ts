/*
* Graph utility functions
* */
export namespace GraphUtil {
    /*
    * Generate config object for cytoscape's rendering engine
    * */
    export function generateCytoConfig(container, graph) {
        return {
            container: container,
            boxSelectionEnabled: false,
            autounselectify: true,
            layout: {
                name: "cose-bilkent",
                animate: false,
                spacingFactor: 5
            },
            style: [
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
            ],
            elements: graph
        };
    }

    /*
    * Calculate the total amounts for each node by summing the edges
    * */
    export function getEdgeTotals(graph) {
        let totals = {};
        const edges = graph.filter(elem => elem.group === "edges");
        edges.forEach(e => {
            if(!totals[e.data.target])
                totals[e.data.target] = { label: e.data.target_label, amount: 0 };
            totals[e.data.target].amount += e.data.weight || e.data.amount;
        });
        return totals;
    }

    /*
    * Make a deep copy of the graph
    * */
    // export function clone(graph) {
    //     return JSON.parse(JSON.stringify(graph));
    // }

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

    export function createNode(data) {
        const nodeConf = { data, position: {x: 0, y: 0}, group: "nodes", classes: data.tags.join(" ")};
        return Object.assign({}, cytoscapeBaseConf, nodeConf);
    }

    export function createEdge(data) {
        const edgeConf = { data, position: {}, group: "edges"};
        return Object.assign({}, cytoscapeBaseConf, edgeConf);
    }

    export function addClass(elem, tag) {
        elem.classes += ` ${tag}`;
    }

}