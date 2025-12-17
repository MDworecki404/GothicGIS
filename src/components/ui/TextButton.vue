<template>
    <v-btn
        :prepend-icon="prependIcon"
        variant="text"
        :text="text"
        :color="color"
        @click="$emit('click')"
    >
    </v-btn>
</template>

<script lang="ts" setup>
defineProps<{
    prependIcon?: string;
    text?: string;
    color?: string;
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>