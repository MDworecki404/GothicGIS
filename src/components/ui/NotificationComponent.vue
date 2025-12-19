<template>
    <v-snackbar
        v-model="isVisible"
        :color="type"
        :timeout="timeout"
    >
        <v-row dense no-gutters>
            <v-icon>{{ icon }}</v-icon>
            <span class="ml-2">{{ $t(message) }}</span>
        </v-row>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useNotifyStore } from '../../services/stores/notify';

const isVisible = ref(false);
const timeout = ref(3000);
const type = ref('info');
const icon = ref('mdi-information');
const message = ref('notification.defaultMessage');

const notifyStore = useNotifyStore();

watch(
    () => notifyStore.notificationConfig,
    (newNotification) => {
        if (newNotification) {
            message.value = newNotification.message;
            type.value = newNotification.type || 'info';
            icon.value = newNotification.icon || 'mdi-information';
            timeout.value = newNotification.timeout || 3000;
            isVisible.value = true;
        }
    },
    { immediate: true }
);
</script>