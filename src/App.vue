<template>
    <div id="app">
        <div id="cy"></div>
    </div>
</template>

<script>
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";
    import coseBilkent from "cytoscape-cose-bilkent";
    import config from "./assets/cytoscape_config";

    cytoscape.use( dagre );
    cytoscape.use( coseBilkent );

    export default {
        name: 'App',
        async mounted() {
            this.renderGraph(config);

            // build the branching dependency table
            const dependencyTable = this.buildDependencyTable("Buggy");

            // flatten out the table
            const edges = dependencyTable.reduce((acc, path) =>{
                path.forEach(edge => acc.push(edge));
                return acc;
            }, []);

            const filteredEdges = cy.edges().filter(e => !edges.includes(e));
            const filteredNodes = cy.nodes().filter(n => !edges.find(e =>
                    e.data("source") === n.data("id") || e.data("target") === n.data("id")));

            cy.remove(filteredEdges);
            cy.remove(filteredNodes);
        },
        methods: {
            renderGraph(config) {
                const cy = window.cy = cytoscape({
                    container: document.getElementById('cy'),
                    boxSelectionEnabled: false,
                    autounselectify: true,

                    // layout: { name: "dagre" },
                    layout: {
                        name: "grid",
                        nodeSep: 100
                    },
                    // layout: {
                    //     name: "cose-bilkent",
                    //     animate: false,
                    //     nodeSep: 20
                    // },
                    // layout: { name: "circle" },

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

            },
            buildDependencyTable(currentNode, localEdges = [], finalEdges = []) {

                let dependencies = cy.edges().filter(e => e.data("sourceLabel") === currentNode);

                // If we're at a node with no dependencies (edges), add the path to the list
                if(dependencies.length <= 0) {
                    return finalEdges.push(localEdges);
                }

                // Else recurse over the dependencies and save the paths from the recursive calls
                dependencies.forEach(dep => {
                    const scopedPath = localEdges.slice(0);
                    scopedPath.push(dep);
                    this.buildDependencyTable(dep.data("targetLabel"), scopedPath, finalEdges);
                });

                return finalEdges;
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