import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

/*
* Function for extracting item and amount info from the json column
* */
function extractItemAndAmount(column: string) {
    const splitPoint = column.indexOf(" ");
    const item = column.substring(splitPoint + 1);
    const amount = column.substring(0, splitPoint);
    return [item, amount];
}

/*
* Cytoscape graph classes
* */
type VertexData = { id: string, weight: number };
class Vertex {
    public data: VertexData;
    public position = {x: 0, y: 0};
    public group = "nodes";
    public removed = false;
    public selected = false;
    public selectable = true;
    public locked = false;
    public grabbable = true;
    public classes = "";
    constructor(data: VertexData) {
        this.data = data;
    }
}

type EdgeData = { id: string, weight: number, source: string, target: string };
class Edge {
    public data: EdgeData;
    public position = {};
    public group = "edges";
    public removed = false;
    public selected = false;
    public selectable = true;
    public locked = false;
    public grabbable = true;
    public classes = "";
    constructor(data: EdgeData) {
        this.data = data;
    }
}

/*
* Start procedure
* */
const resource = resolve("resource/vertices_and_edges.json");
const json = readFileSync(resource, "utf8");
const vertsAndEdges = JSON.parse(json);

const graphConfig = [];

for(const row of vertsAndEdges) {
    const data: VertexData = { id: row.shift(), weight: 0 };
    graphConfig.push(new Vertex(data));
}

for(let i = 0; i < vertsAndEdges.length; i++) {
    for(const col of vertsAndEdges[i]) {
        if(!col) continue;
        const [item, amount] = extractItemAndAmount(col);
        const data: EdgeData = { id: `e${i}`, weight: +amount, source: graphConfig[i].data.id, target: item };
        graphConfig.push(new Edge(data));
    }
}

writeFileSync("resource/cytoscape_config.json", JSON.stringify(graphConfig, null, "  "));
console.log("Success!");
