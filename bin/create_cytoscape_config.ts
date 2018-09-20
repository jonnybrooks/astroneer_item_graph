import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

/*
* Function for extracting item and amount info from the json column
* */
function extractItemNameAndAmount(column: string) {
    const splitPoint = column.indexOf(" ");
    const item = column.substring(splitPoint + 1);
    const amount = column.substring(0, splitPoint);
    return [item, amount];
}

/*
* Cytoscape graph classes
* */
type VertexData = { id: string, weight: number, label: string };
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

type EdgeData = {
    id: string,
    weight: number,
    source: string,
    sourceLabel: string,
    target: string,
    targetLabel: string,
    label: string
};
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

let vertexMap: { [name: string]: string } = {};

for(let i = 0; i < vertsAndEdges.length; i++) {
    const label = vertsAndEdges[i].shift(); // get the item name
    const id = `n${i}`;
    vertexMap[label] = id;
    const data: VertexData = { id, weight: 0, label }; // set vertex data
    graphConfig.push(new Vertex(data)); // add data to config
}

for(let i = 0; i < vertsAndEdges.length; i++) {
    for(let j = 0; j < vertsAndEdges[i].length; j++) {
        const col = vertsAndEdges[i][j];
        if(!col) continue;
        const [itemName, amount] = extractItemNameAndAmount(col);

        const source = graphConfig[i].data.id;
        const sourceLabel = graphConfig[i].data.label;
        const target = vertexMap[itemName];

        const data: EdgeData = { id: `e${i}${j}`, weight: +amount, source, sourceLabel, target, targetLabel: itemName, label: amount };
        graphConfig.push(new Edge(data));
    }
}

const configJs = `export default ${JSON.stringify(graphConfig, null, "  ")}`;
writeFileSync("src/assets/cytoscape_config.js", configJs);
console.log("Success!");
