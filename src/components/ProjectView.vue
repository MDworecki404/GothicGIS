<template>
    <div>
        <desktop-content-container v-if="useCommonStore().isAppLoaded" />
        <globe-container />
    </div>
</template>

<script lang="ts" setup>
import { useCommonStore } from '../services/stores/common';
import DesktopContentContainer from './DesktopContentContainer.vue';
import GlobeContainer from './GlobeContainer.vue';
</script>

<style scoped></style>
