<template>
    <v-dialog v-model="isOpen" :persistent="true" :width="dialogStyle.width">
        <v-card>
            <v-card-text>
                <component :is="component" v-bind="componentProps" />
            </v-card-text>
            <v-card-actions v-if="!disableDefaultClose">
                <TextButton
                    :color="'accent'"
                    :text="$t('closeDialog')"
                    :prepend-icon="'mdi-close-circle-outline'"
                    @click="dialogStore.closeDialog()"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDialogStore } from '../../services/stores/dialog';
import TextButton from './TextButton.vue';

const dialogStore = useDialogStore();

const component = computed(() => dialogStore.openedDialog || null);
const componentProps = computed(() => dialogStore.componentProps || {});
const dialogStyle = computed(() => dialogStore.dialogStyles || {});
const disableDefaultClose = computed(() => dialogStore.disableDefaultClose);

const isOpen = computed({
    get: () => !!dialogStore.openedDialog,
    set: (val: boolean) => {
        if (!val) dialogStore.closeDialog();
    },
});
</script>
