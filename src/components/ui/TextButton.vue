<template>
    <v-btn
        :prepend-icon="prependIcon"
        variant="text"
        :text="text"
        v-tooltip="{
            text: tooltip?.text,
            location: tooltip?.location
        }"
        :color="color"
        :loading="loading"
        @click="$emit('click')"
    >
    </v-btn>
</template>

<script lang="ts" setup>
defineProps<{
    prependIcon?: string;
    text?: string;
    color?: string;
    loading?: boolean;
    tooltip?: {
        text: string;
        location: string;
    }
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>