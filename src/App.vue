<template>
    <div id="app">
        <header>
            <h1>Vertex creation tool</h1>
            <button @click="json.hidden = false" id="display">Display Config</button>
            <button @click="clear" id="clear">Clear Config</button>
            <div id="rank-visibility"> Ranks:
                <label v-for="(r, i) in ranksVisible"> <input type="checkbox" v-model="ranksVisible[i]"> {{ i }}
            </label>
            </div>
        </header>

        <form id="create-vertex" @submit.prevent="createVertex">
            <input type="text" name="name" placeholder="Item Name">
            <input type="number" name="rank" placeholder="Item Rank">
            <button>Create Vertex</button>
        </form>

        <div id="vertices">

            <div class="vertex" v-for="v in vertices" :data-index="v.index" v-if="ranksVisible[v.data.rank]">
                <p class="name">{{ v.data.name }} <sup>{{ v.data.rank }}</sup> </p> ::
                <form class="add-dependency" @submit.prevent="addEdge">
                    <select name="dependency-list" class="dependency-list">
                        <option value="">Add dependency</option>
                        <option v-for="v2 in vertices" :value="v2.index">{{ v2.data.name }}</option>
                    </select>
                    <input type="number" name="amount" placeholder="Amount">
                    <button>Commit</button>
                </form>
                <div class="edges">
                    <div class="edge" v-for="(e, i) in edges" v-if="e.from == v.index" :data-index="i">
                        {{ e.amount }} x {{ vertices[e.to].data.name }}
                        <button @click="edges.splice(i, 1); save();">Delete</button>
                    </div>
                </div>
            </div>

        </div>

        <div id="json" v-if="!json.hidden">
            <button @click="json.hidden = !json.hidden">Close</button>
            <div contenteditable="true" id="json-result"> {{ json.result }} </div>
        </div>

    </div>
</template>

<script>
    import "./dist/graph";
    const storageKey = "config";

    export default {
        name: 'App',
        data() {
            return {
                vertices: [],
                edges: [],
                json: { hidden: true, result: "" },
                ranksVisible: {
                    0: false, 1: true, 2: true, 3: true, 4: true, 5: true
                }
            }
        },
        mounted() {
            const config = localStorage.getItem(storageKey);
            if(!config) return;
            const { vertices, edges } = JSON.parse(config);
            this.vertices = vertices;
            this.edges = edges;
        },
        methods: {
            createVertex(e) {
                const inputs = Array.from(e.target.querySelectorAll("input"));
                const data = inputs.reduce((acc, curr) => Object.assign(acc, {[curr.name]: curr.value}), {});
                const index = this.vertices.length;
                this.vertices.push({ index, data });
                inputs[0].value = "";
                inputs[0].focus();

                // save the config
                this.save();
            },
            addEdge(e) {
                const select = e.target.childNodes[0];
                const from = e.target.closest(".vertex").dataset.index;
                const to = select.options[select.selectedIndex].value;
                const amount = select.nextSibling.value;

                // return if the inputs are empty
                if(!to || !amount) return;

                // update the edge if it already exists, otherwise add it
                const edge = { from, to, amount };
                const existingEdgeIndex = this.edges.findIndex(e => e.to === to && e.from === from);
                existingEdgeIndex >= 0
                    ? this.edges.splice(existingEdgeIndex, 1, edge)
                    : this.edges.push(edge);

                // save the config
                this.save();
            },
            save() {
                const vertices = this.vertices;
                const edges = this.edges;

                const json = JSON.stringify({ vertices, edges }, null, "  ");
                localStorage.setItem(storageKey, json);

                this.json.result = json;
            },
            clear() {
                if(!confirm("This will delete all saved data. Proceed?")) return;
                localStorage.removeItem(storageKey);
                this.vertices = [];
                this.edges = [];
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

    header h1, header button, header div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
    }

    .vertex .name {
        font-weight: bold;
    }
    .vertex .name sup {
        font-weight: normal;
    }

    #json {
        position: fixed;
        top: 10vh;
        right: 5vw;
        background: lightgrey;
        box-sizing: border-box;
    }

    #json button {
        position: absolute;
        right: 20px;
        top: 5px;
    }

    #json-result {
        height: 80vh;
        width: 60vw;
        padding: 3px;
        font-family: monospace;
        white-space: pre;
        overflow-y: scroll;
    }

    .vertex .add-dependency,
    .vertex .name {
        display: inline-block;
    }

    .edge {
        font-size: small;
        background: lightblue;
        display: inline-block;
        margin-right: 5px;
        padding: 3px 5px;
    }

</style>