<template>
    <div class="desktop-content-container">
        <TopButtonsContainer />
        <BottomButtonsContainer />
        <ToolsContainer />
    </div>
</template>

<script lang="ts" setup>
import BottomButtonsContainer from './ui/BottomButtonsContainer.vue';
import ToolsContainer from './ui/ToolsContainer.vue';
import TopButtonsContainer from './ui/TopButtonsContainer.vue';
</script>

<style scoped>
.desktop-content-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
