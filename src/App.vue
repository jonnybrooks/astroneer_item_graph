<template>
    <div id="app">
        <header>
            <h1>Vertex creation tool</h1>
            <button @click="save" id="save">Save Config</button>
            <button @click="clear" id="clear">Clear Config</button>
        </header>

        <form id="create-vertex" @submit.prevent="createVertex">
            <input type="text" name="name" placeholder="Item Name">
            <input type="number" name="rank" placeholder="Item Rank">
            <button>Create Vertex</button>
        </form>

        <div id="vertices">

            <div class="vertex" v-for="v in vertices" :data-index="v.index">
                <p class="name">{{ v.data.name }}</p>
                <label v-for="v2 in vertices" v-if="v.index !== v2.index" class="inactive">
                    {{ v2.data.name }}
                    <input class="dependency"
                           type="number"
                           :name="v2.data.name"
                           placeholder="Amount"
                           :data-index="v2.index"
                           @input="fade"
                           @change="editDependency">
                </label>
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
                json: { hidden: true, result: "" }
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
                inputs.forEach(input => input.value = "");
                inputs[0].focus();
            },
            editDependency(e) {
                const from = e.target.closest(".vertex").dataset.index;
                const to = e.target.dataset.index;
                const amount = e.target.value;

                if(amount > 0) return this.edges.push({ from, to, amount });

                const edge = this.edges.findIndex(e => e.to === to && e.from === from);
                if(edge >= 0) this.edges.splice(edge, 1);
            },
            fade(e) {
                const amount = e.target.value;
                if(amount <= 0) return e.target.closest("label").classList.add("inactive");
                e.target.closest("label").classList.remove("inactive");
            },
            save() {
                if(!confirm("This will overwrite current saved data. Proceed?")) return;
                const vertices = this.vertices;
                const edges = this.edges;

                const json = JSON.stringify({ vertices, edges }, null, "  ");
                localStorage.setItem(storageKey, json);

                this.json.result = json;
                this.json.hidden = false;

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

    header * {
        display: inline-block;
        vertical-align: middle;
        padding-right: 20px;
    }

    .inactive {
        opacity: 0.3;
    }

    .vertex .name {
        font-weight: bold;
    }

    .dependency {
        width: 5vw;
    }

    #json {
        position: fixed;
        height: 80vh;
        width: 60vw;
        top: 10vh;
        right: 5vw;
        background: lightgrey;
        box-sizing: border-box;
    }

    #json-result {
        padding: 3px;
        font-family: monospace;
        white-space: pre;
    }

</style>