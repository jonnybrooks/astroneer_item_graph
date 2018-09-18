<template>
    <div id="app"></div>
</template>

<script>
    import {result} from "./dist/graph";

    export default {
        name: 'App',
        mounted() {
            console.log(result);
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
</style>