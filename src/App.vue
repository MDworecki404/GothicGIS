<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import ZenSelector from './components/ZenSelector.vue';
import { useProjectStore } from './services/stores/project';
import ProjectView from './components/ProjectView.vue';
import { initStores } from './services/stores/init';

const storesInitialized = ref(false);

onBeforeMount(async () => {
    await initStores().then(() => {
        storesInitialized.value = true;
    });
});
</script>

<template>
    <v-app>
        <v-main>
            <v-fade-transition>
                <div
                    class="overlay d-flex align-center justify-center bg-background"
                    v-if="!storesInitialized"
                >
                    <v-progress-circular indeterminate size="128" width="6" color="accent">
                        <v-icon size="86">mdi-alpha-g</v-icon>
                    </v-progress-circular>
                </div>
            </v-fade-transition>
            <v-fade-transition>
                <ZenSelector
                    v-if="
                        useProjectStore().projects.length > 0 && !useProjectStore().workingProject
                    "
                />
            </v-fade-transition>
            <v-fade-transition>
                <ProjectView v-if="useProjectStore().workingProject" />
            </v-fade-transition>
        </v-main>
    </v-app>
</template>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
}
</style>
