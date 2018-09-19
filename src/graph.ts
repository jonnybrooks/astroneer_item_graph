/*
* Data object for vertex
* */
class Item {
    public readonly name: string;
    public readonly rank: number;
    constructor(name: string, rank: number) {
        this.name = name;
        this.rank = rank;
    }
}

/*
* Represents a node in the dependency tree
* */
class Vertex {
    public readonly index: number;
    public data: Item;
    constructor(index: number, data?: Item) {
        this.index = index;
        this.data = data;
    }
    // withData(data: Item): Vertex {
    //     this.data = data;
    //     return this;
    // }
}

/*
* Represents a single dependency, directional dependency between two vertices (items)
* */
class Edge {
    private from: Vertex;
    private to: Vertex;
    public readonly amount: number;
    constructor(from: Vertex, to: Vertex, amount: number) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

/*
* Minimal adjacency matrix representation
* */
class SparseMatrix {
    private rows: number[] = [];
    private cols: number[] = [];
    private vals: Edge[] = [];

    addEdge(edge) {
        this.rows.push(edge.to.index);
        this.cols.push(edge.from.index);
        this.vals.push(edge);
    }

    getEdge(to: number, from: number): Edge | undefined {
        for(let i = 0; i < this.rows.length; i++) {
            if(this.rows[i] === to && this.cols[i] === from)
                return this.vals[i];
        }
    }
}

/*
* Graph class
* */
class Graph {
    public edges: SparseMatrix;
    private readonly vertices: Vertex[];
    constructor(edges: SparseMatrix, vertices: Vertex[] = []) {
        this.edges = edges;
        this.vertices = vertices;
    }

    // reserveVertex(): Vertex {
    //     const index = this.vertices.length;
    //     const v = new Vertex(index);
    //     this.vertices.push(v);
    //     return v;
    // }

    addVertex(v: Vertex) {
        this.vertices[v.index] = v;
        return;
    }

    getVertex(index: number): Vertex {
        return this.vertices[index];
    }
}

/*
* Graph utility functions
* */
namespace Graph {

    type VertexConfig = {index: number, data: { name: string, rank: number }};
    type EdgeConfig = {from: number, to: number, amount: number};
    type GraphConfig = { vertices: VertexConfig[], edges: EdgeConfig[] };

    export function loadGraphConfig(config: GraphConfig) {
        const graph = new Graph(new SparseMatrix());

        for(let v of config.vertices) {
            const data = new Item(v.data.name, v.data.rank);
            graph.addVertex(new Vertex(v.index, data));
        }

        for(let e of config.edges) {
            const to = graph.getVertex(e.to);
            const from = graph.getVertex(e.from);
            if(!to || !from) throw new Error("Error loading config: vertices not found on graph");
            graph.edges.addEdge(new Edge(to, from, 2));
        }

        return graph;
    }
}