<template>
    <div :class="mobile ? 'tools-container-mobile' : 'tools-container'">
        <ToolWrapper
            v-for="([id, tool]) in toolsList"
            :key="id"
            :id="id"
            :component="tool.component"
            :icon="tool.icon"
            :title="tool.name"
            :props="tool.props"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useToolsStore } from '../../services/stores/tools';
import ToolWrapper from './ToolWrapper.vue';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const toolsStore = useToolsStore();
const toolsList = computed(() => Array.from(toolsStore.activeTools.entries()).reverse());
</script>

<style scoped>
.tools-container {
    position: absolute;
    width: auto;
    height: auto;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    overflow-y: auto;
    max-height: calc(100vh - 20px);
    box-sizing: border-box;
    padding-right: 6px;
    pointer-events: none;
}

.tools-container > * {
    flex: 0 0 auto;
    pointer-events: all;
}

.tools-container {
    width: max-content;
    max-width: calc(100vw - 20px);
    overflow-x: visible;
}

.tools-container-mobile {
    position: absolute;
    bottom: 0;
    width: 100dvw;
    overflow: auto;
    height: auto;
    flex-direction: row;
    align-items: center;
    z-index: 15;
}
</style>
