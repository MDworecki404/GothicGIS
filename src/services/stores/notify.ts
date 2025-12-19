import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotifyStore = defineStore('notify', () => {
    const notificationConfig = ref<{
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        timeout: number;
        isVisible: boolean;
        icon?: string;
    }>();

    const showNotification = ({
        message,
        type,
        timeout = 3000,
        icon,
    }: {
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        timeout?: number;
        icon?: string;
    }) => {
        notificationConfig.value = {
            message,
            type,
            timeout,
            isVisible: true,
            icon,
        };
    };

    return {
        notificationConfig,
        showNotification,
    }
});
