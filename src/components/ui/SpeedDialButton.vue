<template>
    <v-speed-dial :location="location" style="pointer-events: all;">
        <template #activator="{ props: activatorProps }">
            <IconButton
                v-bind="activatorProps"
                :icon="icon"
                :tooltip="tooltip"
                custom-class="bg-surface"
                style="pointer-events: all;"
            ></IconButton>
        </template>
        <template v-for="button in list" :key="button.icon">
            <IconButton
                v-if="(button.role === undefined || button.role.includes(useUserStore().loggedUser?.role!))"
                :icon="button.icon"
                :tooltip="{
                    text: button.tooltip.text,
                    position: button.tooltip.position,
                }"
                style="pointer-events: all;"
                custom-class="bg-surface"
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
import { useUserStore } from '../../services/stores/user';

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
