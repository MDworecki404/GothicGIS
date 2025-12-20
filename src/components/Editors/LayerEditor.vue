<template>
    <v-card-text>
        <v-data-table
            :items="layersInTable"
            :headers="headers"
            item-key="id"
            class="elevation-0"
        >
            <template #item.actions>
                <icon-button
                    icon="mdi-pencil-outline"
                    :tooltip="{
                        text: 'editLayer',
                        position: 'left',
                    }"
                    variant="icon"
                ></icon-button>
                <icon-button
                    icon="mdi-trash-can-outline"
                    :tooltip="{
                        text: 'deleteLayer',
                        position: 'right',
                    }"
                    iconColor="error"
                    variant="icon"
                ></icon-button>
            </template>
        </v-data-table>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useLayersStore } from '../../services/stores/layers';
import type { LayerCollectionItem } from '../../services/types/collections';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import IconButton from '../ui/IconButton.vue';

const { t } = useI18n();

const layersInTable = ref<LayerCollectionItem[]>([])

const layersStore = useLayersStore();

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
]

onMounted(() => {
    layersInTable.value = layersStore.layers;
})
</script>
