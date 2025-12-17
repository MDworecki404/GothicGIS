<template>
    <div
        class="buttons-bar d-flex ga-2"
        :style="direction === 'vertical' ? 'flex-direction: column-reverse;' : ''"
    >
        <template v-for="button in list">
            <IconButton
                v-if="button.type === 'icon-button' && (button.role === undefined || button.role.includes(userStore.loggedUser?.role!))"
                :tooltip="{
                    text: button.tooltip.text,
                    position: button.tooltip.position,
                }"
                :icon="button.icon"
                @click="performAction(button.action)"
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { performAction } from '../../services/actions';
import type { UiButtons } from '../../services/types/ui';
import IconButton from './IconButton.vue';
import { useUserStore } from '../../services/stores/user';

const userStore = useUserStore();

defineProps<{
    list: UiButtons;
    direction?: 'horizontal' | 'vertical';
}>();
</script>
