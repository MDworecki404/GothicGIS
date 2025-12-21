<template>
    <v-card-text>
        <v-row dense no-gutters align="center" class="d-flex justify-space-between">
            <text-button
                :text="$t('addLayer')"
                prepend-icon="mdi-plus"
                color="accent"
                class="ma-1 mt-3"
                @click="addLayerDialog"
            ></text-button>
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                :label="$t('searchLayers')"
                variant="outlined"
                density="compact"
                hide-details
            ></v-text-field>
        </v-row>

        <v-data-table
            :search="search"
            :items="layersInTable"
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
                        text: 'editLayer',
                        position: 'left',
                    }"
                    variant="plain"
                    @click="toggleEditLayerDialog(item)"
                ></icon-button>
                <icon-button
                    icon="mdi-trash-can-outline"
                    :tooltip="{
                        text: 'deleteLayer',
                        position: 'right',
                    }"
                    iconColor="error"
                    variant="plain"
                    @click="deleteLayerDialog(item)"
                ></icon-button>
            </template>
        </v-data-table>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import { getDefaultLayerConfig } from '../../services/defaults';
import { useDialogStore } from '../../services/stores/dialog';
import { useLayersStore } from '../../services/stores/layers';
import type { LayerCollectionItem } from '../../services/types/collections';
import IconButton from '../ui/IconButton.vue';
import TextButton from '../ui/TextButton.vue';

const { t } = useI18n();

const layersInTable = ref<LayerCollectionItem[]>([]);

const layersStore = useLayersStore();

const search = ref<string>('');

const headers: DataTableHeader[] = [
    {
        title: t('name'),
        key: 'name',
        align: 'start',
    },
    {
        title: t('type'),
        key: 'type',
        align: 'start',
    },
    {
        title: t('actions'),
        key: 'actions',
        align: 'center',
        sortable: false,
    },
];

const toggleEditLayerDialog = async (item: LayerCollectionItem) => {
    const EditLayerDialog = (await import('./EditLayerDialog.vue')).default;

    useDialogStore().showDialog({
        component: EditLayerDialog,
        dialogStyle: {
            width: 600,
        },
        props: {
            layerItem: item,
        },
    });
};

const addLayerDialog = async () => {
    const EditLayerDialog = (await import('./EditLayerDialog.vue')).default;

    useDialogStore().showDialog({
        component: EditLayerDialog,
        dialogStyle: {
            width: 600,
        },
        props: {
            layerItem: getDefaultLayerConfig(),
        },
    });
};

const deleteLayerDialog = async (item: LayerCollectionItem) => {
    const AreYouSure = (await import('./AreYouSure.vue')).default;

    useDialogStore().showDialog({
        component: AreYouSure,
        disableDefaultCloseButton: true,
        dialogStyle: {
            width: 400,
        },
        props: {
            text: t('areYouSureDeleteLayer', { layerName: item.name }),
            onConfirm: async () => {
                await layersStore.deleteLayer(item.id);
                useDialogStore().closeDialog();
            },
            onCancel: () => {
                useDialogStore().closeDialog();
            },
        },
    });
};

onMounted(() => {
    layersInTable.value = layersStore.layers;
});
</script>
