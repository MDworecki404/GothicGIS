<script setup lang="ts">
import { onBeforeMount } from 'vue';
import ZenSelector from './components/ZenSelector.vue';
import { useProjectStore } from './services/stores/project';
import ProjectView from './components/ProjectView.vue';

onBeforeMount(async () => {
    await useProjectStore().loadProjects();
});
</script>

<template>
    <v-app>
        <v-main>
            <v-fade-transition>
                <ZenSelector v-if="useProjectStore().projects.length > 0 && !useProjectStore().workingProject" />
            </v-fade-transition>
            <v-fade-transition>
                <ProjectView v-if="useProjectStore().workingProject" />
            </v-fade-transition>
        </v-main>
    </v-app>
</template>

<style scoped></style>
