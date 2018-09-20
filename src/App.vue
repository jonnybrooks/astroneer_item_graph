<template>
    <div id="app">
        <div id="select-item-container">
            <select name="select_item" id="select-item" v-model="nodeSelected">
                <option value="">Select an item</option>
                <option v-for="n in allItems" :value="n.data.label">{{ n.data.label }}</option>
            </select>
            <ul id="item-totals" v-if="Object.keys(itemTotals).length">
                <li v-for="item in itemTotals">
                    <span class="label">{{ item.label }}</span>:
                    <span class="amount">{{ item.amount }}</span>
                </li>
            </ul>
        </div>
        <div id="cy"></div>
    </div>
</template>

<script>
    import graphConfig from "./assets/cytoscape_config";
    import {getDependencyGraphForItem, generateRenderConfig, getEdgeTotals} from "./graph_util";
    import cytoscape from "cytoscape";
    import coseBilkent from "cytoscape-cose-bilkent";
    cytoscape.use( coseBilkent );

    export default {
        name: 'App',
        data() {
            return {
                graph: graphConfig,
                allItems: graphConfig.filter(elem => elem.group === "nodes"),
                nodeSelected: ""
            }
        },
        mounted() { this.nodeSelected = "Copper" },
        computed: { itemTotals() { return getEdgeTotals(this.graph) } },
        watch: {
            nodeSelected(newNode) {
                this.graph = getDependencyGraphForItem(newNode, graphConfig);
                const config = generateRenderConfig(document.getElementById("cy"), this.graph);
                return cytoscape(config);
            }
        },
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -999;
        box-sizing: border-box;
    }

    #select-item-container {
        position: absolute;
        left: 5px;
        top: 5px;
    }

    #item-totals {
        list-style: none;
        background: rgba(0,0,0,0.1);
        font-size: 0.9em;
        padding: 10px;
    }

    h1 {
        opacity: 0.5;
        font-size: 1em;
    }

</style>