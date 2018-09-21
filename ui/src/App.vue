<template>
    <div id="app">
        <div id="select-item-container">
            <select name="select_item" id="select-item" v-model="nodeSelected">
                <option value="">Select an item</option>
                <option v-for="n in itemDropdown" :value="n.id">{{ n.label }}</option>
            </select>
            <ul id="item-totals" v-if="nodeSelected && Object.keys(itemTotals).length">
                <li v-for="item in itemTotals">
                    <span class="label">{{ item.label }}</span>:
                    <span class="amount">{{ item.amount }}</span>
                </li>
            </ul>
        </div>
        <div id="cy"></div>
        <div id="nothing-to-display" v-if="!Object.keys(itemTotals).length">This item has no dependencies</div>
    </div>
</template>

<script>
    import {GraphUtil} from "./graph_util";
    import cytoscape from "cytoscape";
    import coseBilkent from "cytoscape-cose-bilkent";
    cytoscape.use(coseBilkent);

    export default {
        name: 'App',
        data() {
            return {
                itemDropdown: [],
                itemTotals: {},
                nodeSelected: ""
            }
        },
        async mounted() {
            const graphArray = await (await fetch("http://localhost:3000/")).json();
            this.itemDropdown = graphArray.filter(e => e.id.startsWith("n"));
        },
        watch: {
            async nodeSelected(newNode) {
                let graph = await (await fetch(`http://localhost:3000/tree/${newNode.substring(1)}`)).json();
                graph = graph.map(e => e.id.startsWith("n")
                    ? GraphUtil.createNode(e)
                    : GraphUtil.createEdge(e)
                );
                this.itemTotals = GraphUtil.getEdgeTotals(GraphUtil.clone(graph));
                const renderConfig = GraphUtil.generateRenderConfig(document.getElementById("cy"), GraphUtil.clone(graph));
                return cytoscape(renderConfig);
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

    #nothing-to-display {
        position: absolute;
        top: 40%;
        right: 50%;
        transform: translate(50%, -50%);
        color: darkgrey;
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