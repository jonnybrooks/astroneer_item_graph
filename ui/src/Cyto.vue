<template>
    <div class="cy-container"></div>
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
                nodeSelected: "",
                tooltipVisible: true,
            }
        },
        async mounted() {
            const graphArray = await (await fetch("http://localhost:3000/")).json();
            this.itemDropdown = graphArray.filter(e => e.id.startsWith("n"));
            this.$nextTick(() => this.selectDropdownFromName("Extenders"));
        },
        watch: {
            async nodeSelected(newNode) {
                let graph = await (await fetch(`http://localhost:3000/tree/${newNode.substring(1)}`)).json();

                // generate the cytoscape graph config
                graph = graph.map(e => e.id.startsWith("n")
                    ? GraphUtil.createNode(e)
                    : GraphUtil.createEdge(e)
                );

                // add the selected class to the selected node
                graph.filter(elem => elem.data.id === newNode)
                     .forEach(node => GraphUtil.addClass(node, "selected"));

                // calculate the item totals for the totals pane
                this.itemTotals = GraphUtil.getEdgeTotals(graph);

                // merge the graph config with the cytoscape config and render it
                const renderConfig = GraphUtil.generateCytoConfig(document.getElementById("cy"), graph);
                return cytoscape(renderConfig);
            }
        },
        methods: {
            selectDropdownFromName(target) {
                const option = Array.from(document.querySelectorAll(`#select-item option`))
                    .find(el => el.text === target);
                if(option) this.nodeSelected = option.value;
            }
        }
    }

</script>

<style>
    #app {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
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
        font-weight: 500;
    }

    #tooltip {
        position: absolute;
        right: 0;
        top: 0;
        height: 3vh;
        width: 5vw;
        background: red;
    }

    h1 {
        opacity: 0.5;
        font-size: 1em;
    }

</style>