// rank: how fundamental some item is. Lower is more fundamental
// reqs: requirements to build this item, and the amount needed
export const items = {
    // level 0 (fundamental) requirements
    bytes: { rank: 0, reqs: {} },
    compound: { rank: 0, reqs: {} },
    resin: {rank: 0, reqs: {} },
    laterite: {rank: 0, reqs: {} },

    // level 1 requirements
    medium_platform_a: { rank: 1, reqs: { resin: 1 }},
    large_platform_a: { rank: 1, reqs: { resin: 2 }},

    // level 2 requirements
    medium_fabricator: { rank: 2, reqs: { compound: 2, medium_platform_a: 1 }},
    smelting_furnace: { rank: 2, reqs: { compound: 2, large_platform_a: 1, bytes: 500 }},
    vehicle_bay: { rank: 2, reqs: { compound: 3, large_platform_a: 1, bytes: 250 }},

    // level 3 requirements
    aluminum: { rank: 3, reqs: { laterite: 1, smelting_furnace: 1 }},

    // level 4 requirements
    buggy: { rank: 4, reqs: { compound: 1, aluminum: 1, vehicle_bay: 1, bytes: 1500 }}
};

// Recursive function for getting nested resource requirements
function getNestedRequirementsFromItemName(catalogue, item, path = "", result = {}) {
    // If a name doesn't exist in the catalogue, throw an error
    if(!catalogue[item]) throw new Error("Item not found in catalogue");

    // Else extract this item's rank and requirements
    const { rank, reqs } = catalogue[item];

    // Give this item a place in the result object
    if(!result.hasOwnProperty(item)) result[item] = { total_amt: 0, branches: [], rank };

    // Loop through this item's requirements recursively
    for(let r in reqs) {
        getNestedRequirementsFromItemName(catalogue, r, (path + " " + r).trim(), result);
        result[r].total_amt += reqs[r];
        result[r].branches.push({ path, amt: reqs[r] });
    }

    return result;
}

function createSortedItemResultArray(itemResult) {
    return Object.entries(itemResult).sort(([, a], [, b]) => a.rank - b.rank );
}

export function getSortedRequirementsFromItemName(catalogue, item) {
    const result = getNestedRequirementsFromItemName(catalogue, item);
    return createSortedItemResultArray(result);
}