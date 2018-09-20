/*
* Graph utility functions
* */
export function getDependencyGraphForItem(item, config, finalEdges = [], finalNodes = []) {
    const node = config.find(n => n.group === "nodes" && n.data.label === item);
    const edges = config.filter(e => e.group === "edges" && e.data.source === node.data.id);
    const localColour = generateHexColour();
    node.data.colour = localColour;
    if (!finalNodes.includes(node))
        finalNodes.push(node);
    if (edges.length === 0)
        return finalNodes;
    edges.forEach(e => {
        e.data.colour = localColour;
        finalEdges.push(e);
        getDependencyGraphForItem(e.data.targetLabel, config, finalEdges, finalNodes);
    });
    return finalNodes.concat(finalEdges);
}
export function generateRenderConfig(container, graph) {
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
                    label: "data(label)"
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
export function getEdgeTotals(graph) {
    console.log(graph.length);
    graph = deleteDuplicateGraphElements(graph);
    console.log(graph.length);
    let totals = {};
    const edges = graph.filter(elem => elem.group === "edges");
    edges.forEach(e => {
        if (e.data.targetLabel === "Compound")
            console.log(e.data.id, e.data.sourceLabel, e.data.targetLabel, e.data.weight);
        if (!totals[e.data.target]) {
            totals[e.data.target] = { label: e.data.targetLabel, amount: 0 };
        }
        totals[e.data.target].amount += e.data.weight;
    });
    return totals;
}
export function clone(graph) {
    return JSON.parse(JSON.stringify(graph));
}
/*
* Helper functions
* */
function deleteDuplicateGraphElements(graph) {
    let exists = {};
    graph = graph.filter(elem => {
        if (!exists[elem.data.id]) {
            exists[elem.data.id] = true;
            return true;
        }
        return false;
    });
    return graph;
}
function generateHexColour() {
    const x = Math.round(0xffffff * Math.random()).toString(16);
    const y = (6 - x.length);
    const z = "000000".substring(0, y);
    return "#" + z + x;
}
//# sourceMappingURL=graph_util.js.map