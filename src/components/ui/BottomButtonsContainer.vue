<template>
    <div
        :class="mobile ? 'bottom-buttons-container-mobile' : 'bottom-buttons-container'"
        :style="mobile && useToolsStore().activeTools.size > 0 ? { paddingBottom: '50px' } : {}"
    >
        <ButtonsBar :list="list" :direction="'vertical'" />
    </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { type UiButtons } from '../../services/types/ui';
import ButtonsBar from './ButtonsBar.vue';
import { useDisplay } from 'vuetify';
import { useToolsStore } from '../../services/stores/tools';

const { mobile } = useDisplay();

const list = ref<UiButtons>([]);

onBeforeMount(async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}properties/ui/bottomButtons.json`);
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

.bottom-buttons-container-mobile {
    position: absolute;
    bottom: 0px;
    left: 0;
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    z-index: 11;
    pointer-events: none;
}

.bottom-buttons-container-mobile > * {
    pointer-events: auto;
}
</style>
