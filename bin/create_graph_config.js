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
    const amount = +column.substring(0, splitPoint);
    return [item, amount];
}
/*
* Start procedure
* */
const resource = path_1.resolve("resource/vertices_and_edges.json");
const json = fs_1.readFileSync(resource, "utf8");
const vertsAndEdges = JSON.parse(json);
const graphConfig = {
    vertices: [],
    edges: [],
};
for (const row of vertsAndEdges) {
    const index = graphConfig.vertices.length;
    const data = { name: row.shift(), rank: 0 };
    graphConfig.vertices.push({ index, data });
}
for (let i = 0; i < vertsAndEdges.length; i++) {
    for (const col of vertsAndEdges[i]) {
        if (!col)
            continue;
        const [item, amount] = extractItemAndAmount(col);
        const { index: to } = graphConfig.vertices.find(v => v.data.name === item);
        graphConfig.edges.push({ from: i, to, amount });
    }
}
fs_1.writeFileSync("resource/graph_config.json", JSON.stringify(graphConfig, null, "  "));
console.log("Success!");
//# sourceMappingURL=create_graph_config.js.map