<template>
    <v-row dense no-gutters>
        <span>{{ text }}</span>
    </v-row>
    <v-row dense no-gutters justify="space-between">
        <TextButton
            :text="$t('confirm')"
            prepend-icon="mdi-check"
            color="success"
            @click="onConfirm"
        ></TextButton>
        <TextButton
            :text="$t('cancel')"
            prepend-icon="mdi-close"
            color="error"
            @click="onCancel"
        ></TextButton>
    </v-row>
</template>

<script setup lang="ts">
import TextButton from '../ui/TextButton.vue';


defineProps<{
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}>();
</script>
