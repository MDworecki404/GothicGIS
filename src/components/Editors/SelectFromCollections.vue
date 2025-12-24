<template>
    <v-skeleton-loader
        v-if="loading"
        type="table"
        class="mx-3 my-2"
    ></v-skeleton-loader>
    <v-card-text v-else>
        <v-row dense no-gutters align="center" class="d-flex justify-space-between">
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                :label="$t('searchItems')"
                variant="outlined"
                density="compact"
                max-width="300"
                class="pa-3"
                hide-details
            ></v-text-field>
        </v-row>

        <v-data-table
            :search="search"
            :items="dataInTable"
            :headers="headers"
            item-key="id"
            class="elevation-0"
            :items-per-page-options="[5, 10, 15, 20, 25]"
            :items-per-page="5"
        >
            <template #item.actions="{ item }">
                <IconButton
                    icon="mdi-check"
                    :tooltip="{
                        position: 'right',
                        text: $t('selectItem'),
                    }"
                    icon-color="accent"
                    variant="text"
                    @click="selectItemCallback(item)"
                ></IconButton>
            </template>
        </v-data-table>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import { useLayersStore } from '../../services/stores/layers';
import { useQuestsStore } from '../../services/stores/quests';
import { useViewsStore } from '../../services/stores/views';
import type {
    LayerCollectionItem,
    QuestCollectionItem,
    ViewConfigItem,
} from '../../services/types/collections';
import IconButton from '../ui/IconButton.vue';

const { collectionId, selectItemCallback } = defineProps<{
    collectionId: string;
    selectItemCallback: (item: ViewConfigItem | LayerCollectionItem | QuestCollectionItem) => void;
}>();

const { t } = useI18n();

type availableTypes = ViewConfigItem | LayerCollectionItem | QuestCollectionItem;

const dataInTable = ref<availableTypes[]>([]);

const search = ref<string>('');

const loading = ref<boolean>(true);

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

onMounted(async () => {
    loading.value = true;
    switch (collectionId) {
        case 'views':
            const viewsStore = useViewsStore();
            await viewsStore.loadViews()
            dataInTable.value = viewsStore.views;
            break;
        case 'quests':
            const questsStore = useQuestsStore();
            await questsStore.loadQuests()
            dataInTable.value = questsStore.quests;
            break;
        case 'layers':
            const layersStore = useLayersStore();
            await layersStore.loadLayers()
            dataInTable.value = layersStore.layers;
            break;
    }
    loading.value = false;
});
</script>
