import {writeFileSync} from "fs";
import {resolve} from "path";

// rank: how fundamental some item is. Lower is more fundamental
// reqs: requirements to build this item, and the amount needed
const items = {
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

// Write the requirements object to file
writeFileSync(
    resolve("resource/items.json"),
    JSON.stringify(items, null, " "));