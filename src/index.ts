import {readFileSync} from "fs";
import {resolve} from "path";

// Declare the item catalogue data layout
type ItemCatalogue = { [item_name: string]: { rank: number, reqs: { [item_name: string]: number } } };
type ItemResult = { [item_name: string]: { total_amt: number, branches: string[], rank: number } };

// Load the items into memory
let catalogue: ItemCatalogue;
try {
    let itemString: string = readFileSync(resolve("resource/items.json"), "utf8");
    catalogue = JSON.parse(itemString);
} catch (e) {
    console.error("Error parsing item map from JSON", e);
}

// Recursive function for getting nested resource requirements
function getNestedRequirementsFromItemName(item: string, path = "", result = {}): ItemResult {
    // If a name doesn't exist in the catalogue, throw an error
    if(!catalogue[item]) throw new Error("Item not found in catalogue");

    // Else extract this item's rank and requirements
    const { rank, reqs } = catalogue[item];

    // Give this item a place in the result object
    if(!result.hasOwnProperty(item)) result[item] = { total_amt: 0, branches: [], rank };

    // Loop through this item's requirements recursively
    for(let r in reqs) {
        getNestedRequirementsFromItemName(r, (path + " " + r).trim(), result);
        result[r].total_amt += reqs[r];
        result[r].branches.push({ path, amt: reqs[r] });
    }

    return result;
}

const result = getNestedRequirementsFromItemName("buggy");
console.log(JSON.stringify(result, null, " "));