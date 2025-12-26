<template>
    <div
        class="buttons-bar d-flex ga-2"
        :style="direction === 'vertical' ? 'flex-direction: column-reverse;' : ''"
    >
        <template v-for="button in list">
            <IconButton
                v-if="button.type === 'icon-button' && (button.role === undefined || button.role.includes(userStore.loggedUser?.role!))"
                v-show="button.dontHide === true || useCommonStore().uiVisible"
                :tooltip="{
                    text: button.tooltip.text,
                    position: button.tooltip.position,
                }"
                :icon="button.icon"
                @click="performAction(button.action)"
            />

            <SpeedDialButton
                v-else-if="
                    button.type === 'speed-dial' &&
                    (button.role === undefined ||
                        button.role.includes(userStore.loggedUser?.role!)) &&
                    useCommonStore().uiVisible
                "
                :icon="button.icon"
                :tooltip="{
                    text: button.tooltip.text,
                    position: button.tooltip.position,
                }"
                :location="button.speedDialLocation"
                :list="button.children"
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { performAction } from '../../services/actions';
import { useCommonStore } from '../../services/stores/common';
import { useUserStore } from '../../services/stores/user';
import type { UiButtons } from '../../services/types/ui';
import IconButton from './IconButton.vue';
import SpeedDialButton from './SpeedDialButton.vue';

const userStore = useUserStore();

defineProps<{
    list: UiButtons;
    direction?: 'horizontal' | 'vertical';
}>();
</script>
