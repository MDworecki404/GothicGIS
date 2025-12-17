<template>
    <div class="tools-container">
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
    gap: 10px;
}
</style>
