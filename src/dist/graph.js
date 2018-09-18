function createEmptyEdgeMatrix(vertexCount) {
    let arr = [];
    for (let i = 0; i < vertexCount; i++) {
        arr[i] = new Array(vertexCount);
    }
    return arr;
}
function populateEdgeMatrix(matrix, catalogue) {
    // Create a hash map of the item indices in the catalogue
    const itemIndices = catalogue.reduce((acc, curr, i) => Object.assign(acc, { [curr.name]: i }), {});
    // Add the edges to the matrix
    catalogue.forEach(({ reqs }, x) => {
        for (const r in reqs) {
            const y = itemIndices[r];
            matrix[x][y] = reqs[r];
        }
    });
    return matrix;
}
function getFacilitationGraph(itemName, catalogue, matrix) {
    const itemIndex = catalogue.findIndex(item => item.name == itemName);
    for (let i = 0; i < matrix.length; i++) {
        console.log(catalogue[i].name, matrix[i][itemIndex]);
    }
}
function getDependencyTable(v, catalogue, matrix, localPath = [], allPaths = []) {
    // Get this vertex's row
    let row = matrix[v];
    // If we're at a level 0 item, add the path to the list
    if (!row.some(val => val > 0)) {
        return allPaths.push(localPath);
    }
    // Else recurse over the dependencies and save the paths from the recursive calls
    row.forEach((val, next) => {
        if (val <= 0)
            return;
        const scopedPath = localPath.slice(0);
        scopedPath.push({ item: catalogue[next].name, amt: val });
        getDependencyTable(next, catalogue, matrix, scopedPath, allPaths);
    });
    return allPaths;
}
const catalogue = [
    // Level 0 requirements
    { name: "bytes", rank: 0, reqs: {} },
    { name: "compound", rank: 0, reqs: {} },
    { name: "resin", rank: 0, reqs: {} },
    { name: "laterite", rank: 0, reqs: {} },
    // level 1 requirements
    { name: "medium_platform_a", rank: 1, reqs: { resin: 1 } },
    { name: "large_platform_a", rank: 1, reqs: { resin: 2 } },
    // level 2 requirements
    { name: "medium_fabricator", rank: 2, reqs: { compound: 2, medium_platform_a: 1 } },
    { name: "smelting_furnace", rank: 2, reqs: { compound: 2, large_platform_a: 1, bytes: 500 } },
    { name: "vehicle_bay", rank: 2, reqs: { compound: 3, large_platform_a: 1, bytes: 250 } },
    // level 3 requirements
    { name: "aluminum", rank: 3, reqs: { laterite: 1, smelting_furnace: 1 } },
    // level 4 requirements
    { name: "buggy", rank: 4, reqs: { compound: 1, aluminum: 1, vehicle_bay: 1, bytes: 1500 } }
];
// Sort the catalogue alphabetically
catalogue.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
// Create a V x V matrix where V is number of vertices in the item graph
let numVertices = catalogue.length;
let matrix = createEmptyEdgeMatrix(numVertices);
// Populate the matrix with edges
populateEdgeMatrix(matrix, catalogue);
// Get the dependency table
const vertex = catalogue.findIndex(item => item.name == "buggy");
export const result = getDependencyTable(vertex, catalogue, matrix);
//# sourceMappingURL=graph.js.map