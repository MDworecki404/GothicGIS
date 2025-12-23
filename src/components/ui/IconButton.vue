<template>
    <v-btn
        icon
        v-tooltip="{
            text: tooltip ? $t(tooltip!.text) : '',
            location: tooltip ? tooltip!.position : 'top',
        }"
        :class="['icon-button rounded-sm bg-surface', customClass]"
        variant="outlined"
        color="accent"
        :size="size"
        @click="$emit('click', $event)"
    >
        <v-icon :size="iconSize" :color="iconColor ? iconColor : 'accent'">{{ icon }}</v-icon>
    </v-btn>
</template>
<script lang="ts" setup>
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
}>();

defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();
</script>
<style scoped></style>
