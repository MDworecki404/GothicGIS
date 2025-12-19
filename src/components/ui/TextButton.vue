<template>
    <v-btn
        :prepend-icon="prependIcon"
        variant="text"
        :text="text"
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
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>