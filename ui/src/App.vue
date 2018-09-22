<template>
    <div id="app">
        <div id="select-item-container">
            <select name="select_item" id="select-item" v-model="nodeSelected">
                <option value="">Select an item</option>
                <option v-for="n in items" :value="n.id">{{ n.label }}</option>
            </select>
            <ul id="item-totals" v-if="nodeSelected && Object.keys(itemTotals).length">
                <li v-for="item in itemTotals">
                    <span class="label">{{ item.label }}</span>:
                    <span class="amount">{{ item.total }}</span>
                </li>
            </ul>
        </div>
        <div id="cy"></div>
        <div id="nothing-to-display" v-if="!Object.keys(itemTotals).length">This item has no dependencies</div>
        <!--<Tooltip id="tooltip" :config="tooltip"></Tooltip>-->
    </div>
</template>

<script>
    import cytoscape from "cytoscape";
    import coseBilkent from "cytoscape-cose-bilkent";
    import {debounce} from "lodash";
    import {GraphUtil} from "./graph_util";
    import Tooltip from "./Tooltip";

    cytoscape.use(coseBilkent);

    export default {
        name: "App",
        data() {
            return {
                items: [],
                tags: {},
                itemTotals: {},
                nodeSelected: "",
                tooltip: {
                    visible: false,
                    label: "",
                    total: 0,
                    tags: null,
                },
                cy: null
            }
        },
        async mounted() {
            // fetch the items and tags
            [this.items, this.tags] = await Promise.all([
                (await fetch("http://localhost:3000/items")).json(),
                (await fetch("http://localhost:3000/tags")).json(),
            ]);

            // create the cytoscape object and add it to data
            const cytoConfig = GraphUtil.generateCytoConfig(document.getElementById("cy"), []);
            this.cy = cytoscape(cytoConfig);

            // register the handler for node tooltip
            // this.cy.on("tap", "node", (evt) => {
            //     const node = evt.target;
            //     this.tooltip.visible = true;
            //     this.tooltip.tags = node.data("tags").reduce((map, tag) =>
            //         Object.assign(map, {[tag]: this.tags[tag] }), {});
            //     this.tooltip.label = this.items.find(item => "n" + item.id === node.data("id")).label;
            //     if(node.data("tags").includes("selected")) return;
            //     this.tooltip.total = this.itemTotals[node.data("id")].total;
            // });

            // handle redrawing the canvas on window resize
            window.addEventListener("resize", debounce(() =>
                this.cy && this.redrawGraph(), 100));

            // todo: debug - select extenders from the list
            // this.$nextTick(() => this.selectDropdownFromName("Extenders"));
        },
        watch: {
            async nodeSelected(newNode) {
                let graph = await (await fetch(`http://localhost:3000/tree/${newNode}`)).json();

                // add the selected tag to the selected node
                graph.filter(e => e.id === "n" + newNode)
                     .forEach(node => node.tags.push("selected"));

                // generate the cytoscape graph config
                graph = graph.map(e => e.id.startsWith("n")
                    ? GraphUtil.createNode(e)
                    : GraphUtil.createEdge(e)
                );

                // calculate the item totals for the totals pane
                this.itemTotals = GraphUtil.getEdgeTotals(graph);

                // replace the contents of the graph with the new nodes
                this.cy.elements().remove();
                this.cy.add(graph);
                this.cy.elements().layout(GraphUtil.defaultLayout).run();
                this.redrawGraph();
            }
        },
        methods: {
            selectDropdownFromName(target) {
                const option = Array.from(document.querySelectorAll(`#select-item option`))
                    .find(el => el.text === target);
                if(option) this.nodeSelected = option.value;
            },
            redrawGraph() {
                this.cy.resize();
                this.cy.fit();
            },
        },
        components: {
            Tooltip
        }
    }

</script>

<style>
    * {
        box-sizing: border-box;
    }

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

</style>