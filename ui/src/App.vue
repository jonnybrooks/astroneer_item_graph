<template>
    <div id="app">
        <div id="left-pane">
            <select name="select_item" id="select-item" v-model="nodeSelected">
                <option value="">Select an item</option>
                <option v-for="n in items" :value="n.id">{{ n.label }}</option>
            </select>
            <section id="build-plan" v-if="this.graph.length > 0">
                <h3>
                    Build Plan
                    <a href="#" @click.prevent="plan = !plan" id="hide-build-plan">{{ plan ? "▴" : "▾" }}</a>
                </h3>
                <ul v-if="plan">
                    <li v-for="step in nodes">
                        {{ capitalise(step.tag_map.verb || "create") }}
                        {{ +step.total ? step.total : "a" }}
                        <a href="#"  @click.prevent="updateTooltip(step.real_id)"> {{ step.label }} </a>
                    </li>
                </ul>
            </section>
        </div>
        <div id="cy"></div>
        <div id="nothing-to-display" v-if="nodes.length < 2">This item has no dependencies</div>
        <Tooltip id="tooltip" :config="tooltip"></Tooltip>
    </div>
</template>

<script>
    import cytoscape from "cytoscape";
    import coseBilkent from "cytoscape-cose-bilkent";
    import {debounce} from "lodash";

    import {GraphUtil} from "./graph_util";
    import {Api} from "./api_util";
    import Tooltip from "./Tooltip";

    cytoscape.use(coseBilkent);

    export default {
        name: "App",
        data() {
            return {
                items: [],
                graph: [],
                nodeSelected: "",
                tooltip: {
                    visible: false,
                    position: { x: 0, y: 0 },
                    node: {}
                },
                plan: true,
                cy: {}
            }
        },
        computed: {
            nodes() { return this.graph.filter(elem => elem.id.startsWith("n")) },
            edges() { return this.graph.filter(elem => elem.id.startsWith("e")) },
            capitalise() { return GraphUtil.capitalise }
        },
        async mounted() {
            // fetch the items and tags
            [this.items] = await Promise.all([
                Api.get("/items")
            ]);

            // create the cytoscape object and add it to data
            const cytoConfig = GraphUtil.generateCytoConfig(document.getElementById("cy"), []);
            this.cy = cytoscape(cytoConfig);

            // register the handler for node tooltip
            this.cy.on("tap", "node", (evt) => {
                const node = evt.target;
                this.tooltip.visible = true;
                this.tooltip.node = node.data();
            });

            // handle redrawing the canvas on window resize
            window.addEventListener("resize", debounce(() =>
                this.cy && this.redrawGraph(), 100));

            // todo: debug - select extenders from the list
            // this.$nextTick(() => this.selectDropdownFromName("Extenders"));
        },
        watch: {
            async nodeSelected(newNode) {
                this.tooltip.visible = false;

                // if the placeholder was selected reset everything
                if(!newNode) {
                    this.graph = [];
                    return this.cy.elements().remove();
                }

                this.graph = await Api.get(`/tree/${newNode}`);

                // add the selected tag to the selected node
                const selected = this.nodes.find(n => n.real_id === +newNode);
                if(selected) GraphUtil.addTag(selected, "selected", true);

                // construct the cytoscape graph array from the nodes and edges
                const cytoGraph = this.nodes.map(GraphUtil.createNode)
                    .concat(this.edges.map(GraphUtil.createEdge));

                // replace the contents of the graph with the new array
                this.cy.elements().remove();
                if(this.nodes.length > 1)  {
                    this.cy.add(cytoGraph);
                    this.cy.elements().layout(GraphUtil.defaultLayout).run();
                }
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
            updateTooltip(nodeId) {
                this.tooltip.node = this.nodes.find(n => n.real_id === nodeId);
                this.tooltip.visible = true;
            }
        },
        components: {
            Tooltip
        }
    }

</script>

<style>
    @import "fonts.css";

    * {
        box-sizing: border-box;
    }

    html, body, #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 0;
        margin: 0;
    }

    #app {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 5px;
    }

    select {
        font-size: 1em;
    }

    #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 50;
        box-sizing: border-box;
    }

    #nothing-to-display {
        position: absolute;
        top: 40%;
        right: 50%;
        transform: translate(50%, -50%);
        color: darkgrey;
    }

    #left-pane {
        position: absolute;
        left: 0;
        top: 0;
        max-width: 50%;
        padding: inherit;
        z-index: 100;
    }

    #build-plan {
        position: relative;
        padding: 10px 25px 0 10px;
        font-weight: 500;
        background: rgba(0,0,0,0.5);
        color: white;
        border-radius: 5px;
        max-height: 93vh;
        overflow: auto;
        margin-top: 10px;
        white-space: nowrap;
        width: 100%;
    }

    #hide-build-plan {
        position: absolute;
        top: 0;
        right: 5px;
        text-decoration: none;
        padding: 5px;
    }

    #build-plan h3 {
        margin: 0 0 15px 0;
    }

    #build-plan ul {
        list-style: none;
        font-size: 0.9em;
        margin: 0;
        padding: 0 0 20px 0;
    }

    #build-plan li {
        margin: 3px 0;
    }

    #build-plan a {
        color: white;
        font-size: 1.2em;
    }

    @media screen and (max-width: 450px) {
        select {
            width: 100%;
        }
        #left-pane {
            min-width: 100%;
        }
    }

</style>