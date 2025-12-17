<template>
    <v-speed-dial :location="location">
        <template #activator="{ props: activatorProps }">
            <IconButton
                v-bind="activatorProps"
                :icon="icon"
                :tooltip="tooltip"
            ></IconButton>
        </template>
        <template v-for="button in list" :key="button.icon">
            <IconButton
                :icon="button.icon"
                :tooltip="{
                    text: button.tooltip.text,
                    position: button.tooltip.position,
                }"
                @click="performAction(button.action)"
            />
        </template>
    </v-speed-dial>
</template>

<script lang="ts" setup>
import type { Anchor } from 'vuetify';
import type { IconButton as IconButtonType } from '../../services/types/ui';
import IconButton from './IconButton.vue';
import { performAction } from '../../services/actions';

defineProps<{
    icon: string;
    tooltip: {
        text: string;
        position: 'top' | 'bottom' | 'left' | 'right';
    };
    location: Anchor;
    list: IconButtonType[];
}>();
</script>
