<template>
    <div class="content-container">
        <TopButtonsContainer />
        <BottomButtonsContainer />
        <div v-show="useCommonStore().uiVisible">
            <ToolsContainer />
        </div>
        <div v-show="useCommonStore().uiVisible">
            <NotificationComponent />
        </div>
    </div>
</template>

<script lang="ts" setup>
import BottomButtonsContainer from './ui/BottomButtonsContainer.vue';
import ToolsContainer from './ui/ToolsContainer.vue';
import TopButtonsContainer from './ui/TopButtonsContainer.vue';
import NotificationComponent from './ui/NotificationComponent.vue';
import { useCommonStore } from '../services/stores/common';
</script>

<style scoped>
.content-container {
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
