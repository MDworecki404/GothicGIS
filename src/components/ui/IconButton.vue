<template>
    <v-btn
        icon
        v-tooltip="{
            text: $t(tooltip.text),
            location: tooltip.position,
        }"
        class="icon-button rounded-sm bg-surface"
        variant="outlined"
        color="accent"
        :size="size"
        @click="$emit('click')"
    >
        <v-icon :size="iconSize" color="accent">{{ icon }}</v-icon>
    </v-btn>
</template>
<script lang="ts" setup>
const { size = 32, iconSize = 20 } = defineProps<{
    icon: string;
    tooltip: {
        text: string;
        position: 'top' | 'bottom' | 'left' | 'right';
    };
    size?: number;
    iconSize?: number;
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>
<style scoped></style>
