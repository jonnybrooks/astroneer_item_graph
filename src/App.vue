<template>
    <div id="app">
        <div id="cy"></div>
    </div>
</template>

<script>
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";
    // import coseBilkent from "cytoscape-cose-bilkent";
    import config from "./assets/cytoscape_config";

    cytoscape.use( dagre );
    // cytoscape.use( coseBilkent );

    export default {
        name: 'App',
        async mounted() {
            this.renderGraph(config);
            this.filterNodes();
        },
        methods: {
            renderGraph(config) {
                const cy = window.cy = cytoscape({
                    container: document.getElementById('cy'),
                    boxSelectionEnabled: false,
                    autounselectify: true,
                    // layout: { name: "dagre" },
                    layout: { name: "grid" },
                    // layout: { name: "cose-bilkent", animate: false },
                    style: [
                        {
                            selector: "node",
                            style: {
                                height: 20,
                                width: 20,
                                "background-color": "#18e018",
                                label: "data(label)"
                            }
                        },
                        {
                            selector: "edge",
                            style: {
                                "curve-style": "bezier",
                                "width": 5,
                                "opacity": 0.5,
                                "target-arrow-shape": "triangle",
                                "target-arrow-color": "#a2efa2",
                                "line-color": "#a2efa2",
                                label: "data(label)"
                            }
                        }
                    ],
                    elements: config
                });
            },
            filterNodes() {

                let filtered = cy.edges().filter(e => {
                    console.log(e.data("targetLabel"));
                    return e.data("targetLabel") !== "Large Platform A"
                });
                filtered = cy.remove(filtered.union(filtered.connectedEdges()));
                cy.remove(filtered);
                // filtered.restore();

            }
        }
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
        z-index: 999;
    }

    h1 {
        opacity: 0.5;
        font-size: 1em;
    }

</style>