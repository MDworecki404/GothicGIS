<template>
    <v-skeleton-loader
        v-if="!viewsInTable.length"
        type="table"
        class="mx-3 my-2"
    ></v-skeleton-loader>
    <v-card-text v-else>
        <v-row dense no-gutters align="center" class="d-flex justify-space-between">
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                :label="$t('searchViews')"
                variant="outlined"
                density="compact"
                max-width="300"
                class="pa-3"
                hide-details
            ></v-text-field>
        </v-row>

        <v-data-table
            :search="search"
            :items="viewsInTable"
            :headers="headers"
            item-key="id"
            class="elevation-0"
            :items-per-page-options="[5, 10, 15, 20, 25]"
            :items-per-page="5"
        >
            <template #item.actions="{ item }">
                <icon-button
                    icon="mdi-pencil-outline"
                    :tooltip="{
                        text: 'editView',
                        position: 'left',
                    }"
                    variant="plain"
                    @click="toggleEditViewDialog(item)"
                ></icon-button>
                <icon-button
                    icon="mdi-airplane-landing"
                    iconColor="primary"
                    :tooltip="{
                        text: 'activate',
                        position: 'bottom',
                    }"
                    variant="plain"
                    @click="activateView(item)"
                ></icon-button>
                <icon-button
                    icon="mdi-trash-can-outline"
                    :tooltip="{
                        text: 'deleteView',
                        position: 'right',
                    }"
                    iconColor="error"
                    variant="plain"
                    @click="deleteViewDialog(item)"
                ></icon-button>
            </template>
        </v-data-table>
    </v-card-text>
</template>

<script lang="ts" setup>
import { Cartesian3 } from 'cesium';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import { globeInstance } from '../../services/globe/globe';
import { useDialogStore } from '../../services/stores/dialog';
import { useViewsStore } from '../../services/stores/views';
import type { ViewConfigItem } from '../../services/types/collections';
import IconButton from '../ui/IconButton.vue';

const { t } = useI18n();

const viewsInTable = ref<ViewConfigItem[]>([]);

const viewsStore = useViewsStore();

const search = ref<string>('');

const headers: DataTableHeader[] = [
    {
        title: t('name'),
        key: 'name',
        align: 'start',
    },
    {
        title: t('actions'),
        key: 'actions',
        align: 'center',
        sortable: false,
    },
];

const activateView = async (item: ViewConfigItem) => {
    globeInstance?.viewer?.camera.flyTo({
        destination: Cartesian3.fromArray([item.view.x, item.view.y, item.view.z]),
        orientation: {
            heading: item.view.heading,
            pitch: item.view.pitch,
            roll: 0,
        },
        duration: 2,
    });
};

const toggleEditViewDialog = async (item: ViewConfigItem) => {
    const EditViewDialog = (await import('./EditViewDialog.vue')).default;

    useDialogStore().showDialog({
        component: EditViewDialog,
        dialogStyle: {
            width: 600,
        },
        props: {
            viewItem: item,
        },
    });
};

const deleteViewDialog = async (item: ViewConfigItem) => {
    const AreYouSure = (await import('./AreYouSure.vue')).default;

    useDialogStore().showDialog({
        component: AreYouSure,
        disableDefaultCloseButton: true,
        dialogStyle: {
            width: 400,
        },
        props: {
            text: t('areYouSureDeleteView', { viewName: item.name }),
            onConfirm: async () => {
                await viewsStore.deleteViewConfig(item.id);
                useDialogStore().closeDialog();
            },
            onCancel: () => {
                useDialogStore().closeDialog();
            },
        },
    });
};

onMounted(async () => {
    await viewsStore.loadViews();
    viewsInTable.value = viewsStore.views;
});
</script>
