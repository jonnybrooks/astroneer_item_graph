"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
/*
* Function for extracting item and amount info from the json column
* */
function extractItemAndAmount(column) {
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
for (const row of vertsAndEdges) {
    const data = { id: row.shift(), weight: 0 };
    graphConfig.push(new Vertex(data));
}
for (let i = 0; i < vertsAndEdges.length; i++) {
    for (const col of vertsAndEdges[i]) {
        if (!col)
            continue;
        const [item, amount] = extractItemAndAmount(col);
        const data = { id: `e${i}`, weight: +amount, source: graphConfig[i].data.id, target: item };
        graphConfig.push(new Edge(data));
    }
}
fs_1.writeFileSync("resource/cytoscape_config.json", JSON.stringify(graphConfig, null, "  "));
console.log("Success!");
//# sourceMappingURL=create_cytoscape_config.js.map