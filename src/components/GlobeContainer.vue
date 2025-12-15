<template>
    <div id="globeContainer"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { initGlobeInstance } from '../services/globe/globe';

onMounted(() => {
    initGlobeInstance(
        document.getElementById('globeContainer')!
    );
});
</script>

<style scoped>
#globeContainer {
    width: 100%;
    height: 100vh;
}
</style>
