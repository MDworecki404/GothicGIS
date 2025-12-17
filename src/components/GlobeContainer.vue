<template>
    <div class="globe-root">
        <v-fade-transition>
            <div
                class="overlay d-flex align-center justify-center bg-background"
                v-if="!commonStore.isAppLoaded"
            >
                <v-progress-circular indeterminate size="128" width="6" color="accent">
                    <v-icon size="86">mdi-alpha-g</v-icon>
                </v-progress-circular>
            </div>
        </v-fade-transition>
        <v-fade-transition>
            <div id="globeContainer"></div>
        </v-fade-transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { initGlobeInstance } from '../services/globe/globe';
import { useCommonStore } from '../services/stores/common';

const commonStore = useCommonStore();

onMounted(() => {
    initGlobeInstance(document.getElementById('globeContainer')!, true);
});
</script>

<style scoped>
#globeContainer {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
}

.globe-root {
    position: absolute;
    width: 100%;
    height: 100vh;
}
</style>
