<template>
    <div id="app">

        <div id="line">
            <div class="item" v-for="item in items">{{ item.name }}</div>
        </div>

    </div>
</template>

<script>
    import {getDependencyTable} from "./dist/graph";

    export default {
        name: 'App',
        data() {
            return {
                items: []
            }
        },
        mounted() {
            const dt = getDependencyTable("buggy");
            this.renderDependencyTable(dt);
        },
        methods: {
            renderDependencyTable(table) {
                let renderMap = {};
                table.forEach((row, i) => {
                    row.forEach((col, j) => {
                        if(!renderMap[col.name]) {
                            renderMap[col.name] = 0;
                            this.items.push(col);
                        }
                        renderMap[col.name] += col.amt;
                    })
                });
            }
        },
        components: {},
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #line {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .item {
        display: inline-block;
        /*transform: rotateZ(-90deg) translateX(-50%);*/
        transform-origin: center;
    }

</style>