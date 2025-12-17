<template>
    <div>
        <desktop-content-container v-if="useCommonStore().isAppLoaded" />
        <globe-container :key="globeKey"/>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useCommonStore } from '../services/stores/common';
import { useProjectStore } from '../services/stores/project';
import DesktopContentContainer from './DesktopContentContainer.vue';
import GlobeContainer from './GlobeContainer.vue';

const globeKey = ref(0);

watch(
    () => useProjectStore().workingProject,
    (newProject) => {
        if (!newProject) {
        } else {
            globeKey.value += 1
        }
    },
    { immediate: true }
);
</script>

<style scoped></style>
