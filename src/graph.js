"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* Data object for vertex
* */
class Item {
    constructor(name, rank) {
        this.name = name;
        this.rank = rank;
    }
}
/*
* Represents a node in the dependency tree
* */
class Vertex {
    constructor(index, data) {
        this.index = index;
        this.data = data;
    }
}
/*
* Represents a single dependency, directional dependency between two vertices (items)
* */
class Edge {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}
/*
* Minimal adjacency matrix representation
* */
class SparseMatrix {
    constructor() {
        this.rows = [];
        this.cols = [];
        this.vals = [];
    }
    addEdge(edge) {
        this.rows.push(edge.to.index);
        this.cols.push(edge.from.index);
        this.vals.push(edge);
    }
    getEdge(to, from) {
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i] === to && this.cols[i] === from)
                return this.vals[i];
        }
    }
}
/*
* Graph class
* */
class Graph {
    constructor(edges, vertices = []) {
        this.edges = edges;
        this.vertices = vertices;
    }
    // reserveVertex(): Vertex {
    //     const index = this.vertices.length;
    //     const v = new Vertex(index);
    //     this.vertices.push(v);
    //     return v;
    // }
    addVertex(v) {
        this.vertices[v.index] = v;
        return;
    }
    getVertex(index) {
        return this.vertices[index];
    }
}
/*
* Graph utility functions
* */
(function (Graph) {
    function loadGraphConfig(config) {
        const graph = new Graph(new SparseMatrix());
        for (let v of config.vertices) {
            const data = new Item(v.data.name, v.data.rank);
            graph.addVertex(new Vertex(v.index, data));
        }
        for (let e of config.edges) {
            const to = graph.getVertex(e.to);
            const from = graph.getVertex(e.from);
            if (!to || !from)
                throw new Error("Error loading config: vertices not found on graph");
            graph.edges.addEdge(new Edge(to, from, 2));
        }
        return graph;
    }
    Graph.loadGraphConfig = loadGraphConfig;
})(Graph || (Graph = {}));
// const g = Graph.loadGraphConfig(graphConfig);
// console.log(g.edges.getEdge(0, 1));
// console.log(g.edges.getEdge(1, 0));
//# sourceMappingURL=graph.js.map