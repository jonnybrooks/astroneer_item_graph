<template>
    <div class="tooltip-container" v-if="config.visible">
        <h1>{{ config.label }}</h1>
        <p v-if="!config.tags.selected">Amount: {{ config.total }}</p>
        <section id="planet-availability" v-if="config.tags.fundamental">
            <h3>Found on</h3>
            <ul><li v-for="p in planets" v-if="config.tags[p.tag]">{{ p.name }}</li></ul>
        </section>
        <section>
            <h3>Notes</h3>
            <ul id="tags">
                <li v-for="(desc) in config.tags">{{ desc }}</li>
            </ul>
        </section>
    </div>
</template>

<script>
    export default {
        name: "Tooltip",
        props: ["config"],
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
                ]
            }
        }
    }

</script>

<style scoped>
    .tooltip-container {
        position: absolute;
        right: 0;
        top: 0;
        background: cornflowerblue;
    }
</style>