<template>
    <v-btn
        icon
        v-tooltip="{
            text: tooltip ? $t(tooltip!.text) : '',
            location: tooltip ? tooltip!.position : 'top',
        }"
        :class="['icon-button rounded-sm', customClass]"
        :size="size"
        color="accent"
        :variant="variant ? variant : 'outlined'"
        @click="$emit('click', $event)"
    >
        <v-icon :size="iconSize" :color="iconColor ? iconColor : 'accent'">{{ icon }}</v-icon>
    </v-btn>
</template>
<script lang="ts" setup>
import type { Variant } from 'vuetify/lib/composables/variant.mjs';

const { size = 32, iconSize = 20 } = defineProps<{
    icon: string;
    tooltip?: {
        text: string;
        position: 'top' | 'bottom' | 'left' | 'right';
    };
    size?: number;
    iconSize?: number;
    customClass?: string;
    iconColor?: string;
    variant?: Variant
}>();

defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();
</script>
<style scoped></style>
