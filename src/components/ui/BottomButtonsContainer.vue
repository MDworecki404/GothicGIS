<template>
    <div class="bottom-buttons-container">
        <ButtonsBar
            :list="list"
            :direction="'vertical'"
        />
    </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { type UiButtons } from '../../services/types/ui';
import ButtonsBar from './ButtonsBar.vue';

const list = ref<UiButtons>([]);

onBeforeMount(async () => {
    const res = await fetch('/properties/ui/bottomButtons.json');
    const BottomButtonsJson: UiButtons = await res.json();

    list.value = BottomButtonsJson;
});
</script>

<style scoped>
.bottom-buttons-container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    z-index: 11;
    pointer-events: none;
}
.bottom-buttons-container > * {
    pointer-events: auto;
}
</style>
