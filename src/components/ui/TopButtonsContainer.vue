<template>
    <div class="top-buttons-container">
        <ButtonsBar
            :list="list"
        />
    </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { type UiButtons } from '../../services/types/ui';
import ButtonsBar from './ButtonsBar.vue';

const list = ref<UiButtons>([]);

onBeforeMount(async () => {
    const res = await fetch('/properties/ui/topButtons.json');
    const TopButtonsJson: UiButtons = await res.json();

    list.value = TopButtonsJson;
});
</script>

<style scoped>
.top-buttons-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    z-index: 11;
    pointer-events: none;
}
.top-buttons-container > * {
    pointer-events: auto;
}
</style>
