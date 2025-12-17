import { defineStore } from 'pinia';
import { markRaw, ref, type Component } from 'vue';

export const useDialogStore = defineStore('dialog', () => {
    const openedDialog = ref<Component | null>(null);
    const componentProps = ref<Record<string, unknown> | null>(null);
    const dialogStyles = ref<{
        width?: number;
        height?: number;
        maxWidth?: number;
        maxHeight?: number;
    }>({})

    const showDialog = ({
        component,
        props,
        dialogStyle
    }: {
        component: Component;
        props?: Record<string, unknown>;
        dialogStyle?: typeof dialogStyles.value;
    }) => {
        openedDialog.value = markRaw(component);
        componentProps.value = props || null;
        if (dialogStyle) {
            dialogStyles.value = dialogStyle;
        } else {
            dialogStyles.value = {};
        }
        return Promise.resolve();
    };

    const closeDialog = () => {
        openedDialog.value = null;
        componentProps.value = null;
        return Promise.resolve();
    }

    return {
        openedDialog,
        componentProps,
        dialogStyles,
        showDialog,
        closeDialog,
    };
});
