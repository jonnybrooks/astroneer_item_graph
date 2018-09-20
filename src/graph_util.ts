export function getDependencyGraphForItem(item, config) {
    const graph = buildGraph(item, config);
    return deleteDuplicateGraphElements(graph);
}

function buildGraph(item, config, finalEdges = [], finalNodes = []) {
    const node = config.find(n => n.group === "nodes" && n.data.label === item);
    const edges = config.filter(e => e.group === "edges" && e.data.source === node.data.id);

    if(!finalNodes.includes(node)) finalNodes.push(node);
    if(edges.length === 0) return finalNodes;

    edges.forEach(e => {
        finalEdges.push(e);
        buildGraph(e.data.targetLabel, config, finalEdges, finalNodes);
    });

    return finalNodes.concat(finalEdges);
}

function deleteDuplicateGraphElements(graph) {
    let elemsVisited = {};
    let toBeDeleted = [];
    graph.forEach((elem, i) => {
        if(elemsVisited[elem.data.id]) return toBeDeleted.push(i);
        elemsVisited[elem.data.id] = true;
    });
    toBeDeleted.forEach((index) => graph.splice(index, 1));
    return graph;
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
                        "background-color": "#18e018",
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
                        "target-arrow-color": "#a2efa2",
                        "line-color": "#a2efa2",
                        label: "data(label)"
                    }
                }
            ],
            elements: graph
        };
    }

export function getEdgeTotals(graph) {
    let totals = {};
    graph = JSON.parse(JSON.stringify(graph));
    const edges = graph.filter(elem => elem.group === "edges");
    edges.forEach(e => {
        if(!totals[e.data.target]) {
            totals[e.data.target] = { label: e.data.targetLabel, amount: 0 };
        }
        totals[e.data.target].amount += e.data.weight;
    });
    return totals;
}

