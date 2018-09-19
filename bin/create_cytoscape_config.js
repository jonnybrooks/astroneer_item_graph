"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
/*
* Function for extracting item and amount info from the json column
* */
function extractItemNameAndAmount(column) {
    const splitPoint = column.indexOf(" ");
    const item = column.substring(splitPoint + 1);
    const amount = column.substring(0, splitPoint);
    return [item, amount];
}
class Vertex {
    constructor(data) {
        this.position = { x: 0, y: 0 };
        this.group = "nodes";
        this.removed = false;
        this.selected = false;
        this.selectable = true;
        this.locked = false;
        this.grabbable = true;
        this.classes = "";
        this.data = data;
    }
}
class Edge {
    constructor(data) {
        this.position = {};
        this.group = "edges";
        this.removed = false;
        this.selected = false;
        this.selectable = true;
        this.locked = false;
        this.grabbable = true;
        this.classes = "";
        this.data = data;
    }
}
/*
* Start procedure
* */
const resource = path_1.resolve("resource/vertices_and_edges.json");
const json = fs_1.readFileSync(resource, "utf8");
const vertsAndEdges = JSON.parse(json);
const graphConfig = [];
let vertexMap = {};
for (let i = 0; i < vertsAndEdges.length; i++) {
    const label = vertsAndEdges[i].shift(); // get the item name
    const id = `n${i}`;
    vertexMap[label] = id;
    const data = { id, weight: 0, label }; // set vertex data
    graphConfig.push(new Vertex(data)); // add data to config
}
for (let i = 0; i < vertsAndEdges.length; i++) {
    for (let j = 0; j < vertsAndEdges[i].length; j++) {
        const col = vertsAndEdges[i][j];
        if (!col)
            continue;
        const [itemName, amount] = extractItemNameAndAmount(col);
        const source = graphConfig[i].data.id;
        const sourceLabel = graphConfig[i].data.label;
        const target = vertexMap[itemName];
        const data = { id: `e${i}${j}`, weight: +amount, source, sourceLabel, target, targetLabel: itemName, label: amount };
        graphConfig.push(new Edge(data));
    }
}
const configJs = `export default ${JSON.stringify(graphConfig, null, "  ")}`;
fs_1.writeFileSync("src/assets/cytoscape_config.js", configJs);
console.log("Success!");
//# sourceMappingURL=create_cytoscape_config.js.map