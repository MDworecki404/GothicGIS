<template>
    <div class="overlay d-flex align-center justify-center" v-if="!commonStore.isAppLoaded">
        <v-progress-circular
            indeterminate
            size="128"
            width="6"
            color="accent"
        >
            <v-icon size="86">mdi-alpha-g</v-icon>
        </v-progress-circular>
    </div>
</template>

<script lang="ts" setup>
    import { useCommonStore } from '../services/stores/common';

    const commonStore = useCommonStore();
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}
</style>