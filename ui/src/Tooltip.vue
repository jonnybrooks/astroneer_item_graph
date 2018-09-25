<template>
    <div class="tooltip-container" v-if="config.visible">
        <h2>
            {{ node.label }}
            <!--<sup>{{ node.real_id }}</sup> -->
            <a href="#" @click.prevent="config.visible = false" id="tooltip-close">&#215;</a>
        </h2>

        <section>
            <p v-if="node.total > 0">Amount: {{ node.total }}</p>
            <p v-if="node.tag_map.built_at">
                Build at: {{ readableTag(node.tag_map.built_at) }}
            </p>
        </section>

        <section v-if="localDependencies.length > 0">
            <p>Requires:</p>
            <ul>
                <li v-for="dep in localDependencies">
                    {{ dep.amount }}
                    {{ dep.label }}
                </li>
            </ul>
        </section>

        <section id="availability" v-if="node.tag_map.fundamental || node.tag_map.atmospheric">
            <p v-if="node.tag_map.fundamental">Found on:</p>
            <p v-else>Condensed on:</p>
            <ul>
                <li v-for="p in planets"
                    v-if="node.tag_map.all_planets || node.tag_map[p.tag]">
                    {{ p.name }}
                </li>
            </ul>
        </section>

    </div>
</template>

<script>
    import {Api} from "./api_util";
    import {GraphUtil} from "./graph_util";

    export default {
        name: "Tooltip",
        props: ["config"],
        computed: {
            node() { return this.config.node },
            readableTag() { return GraphUtil.makeTagReadable }
        },
        data() {
            return {
                chars: { yes: "✔", no: "✘" },
                planets: [
                    { name: "Terran", tag: "terran" },
                    { name: "Barren", tag: "barren" },
                    { name: "Exotic", tag: "exotic" },
                    { name: "Arid", tag: "arid" },
                    { name: "Radiated", tag: "radiated" },
                    { name: "Tundra", tag: "tundra" },
                ],
                localDependencies: []
            }
        },
        watch: {
            async node(val) {
                this.localDependencies = await Api.get(`/local_dependencies/${val.real_id}`);
                this.config.visible = true;
            }
        }
    }

</script>

<style scoped>
    .tooltip-container {
        position: absolute;
        right: 10px;
        top: 10px;
        background: rgba(0,0,0,0.5);
        color: white;
        border-radius: 5px;
        padding: 10px 20px 10px 10px;
        min-width: 15vw;
        z-index: 110;
    }

    #tooltip-close {
        background: white;
        color: black;
        padding: 0 0.4em;
        border-radius: 5px;
        font-size: 0.8em;
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
        text-decoration: none;
    }

    section {
        margin-bottom: 10px;
    }

    p {
        margin: 0;
    }

    ul {
        list-style-position: inside;
        padding: 0;
        margin: 0;
    }

    h2 {
        margin: 0 0 15px 0;
        padding-right: 1em;
    }

    @media screen and (max-width: 450px) {
        #tooltip {
            background: rgba(255,255,255,0.9);
            color: black;
            box-shadow: 0 0 6px 1px rgba(0,0,0,0.3);
        }
    }

</style>