<template>
    <v-skeleton-loader v-if="loading" type="table" class="mx-3 my-2"></v-skeleton-loader>
    <v-card-text v-else>
        <v-row dense no-gutters align="center" class="d-flex justify-space-between">
            <text-button
                prepend-icon="mdi-plus"
                color="accent"
                :text="$t('addQuest')"
            ></text-button>
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                :label="$t('searchQuests')"
                variant="outlined"
                density="compact"
                max-width="300"
                class="pa-3"
                hide-details
            ></v-text-field>
        </v-row>

        <v-data-table
            :search="search"
            :items="questsInTable"
            :headers="headers"
            item-key="id"
            class="elevation-0"
            :items-per-page-options="[5, 10, 15, 20, 25]"
            :items-per-page="5"
        >
            <template #item.actions="{ item }">
                <context-menu :context-menu-items="contextMenuItems" :prop-item="item">
                </context-menu>
            </template>
        </v-data-table>
    </v-card-text>
</template>

<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import { useQuestsStore } from '../../services/stores/quests';
import { useToolsStore } from '../../services/stores/tools';
import type { QuestCollectionItem } from '../../services/types/collections';
import type { ContextMenuItems } from '../../services/types/ui';
import ContextMenu from '../ui/ContextMenu.vue';
import TextButton from '../ui/TextButton.vue';

const { t } = useI18n();

const questsInTable = ref<QuestCollectionItem[]>([]);

const questsStore = useQuestsStore();

const search = ref<string>('');

const loading = ref<boolean>(true);

const headers: DataTableHeader[] = [
    {
        title: t('name'),
        key: 'name',
        align: 'start',
    },
    {
        title: t('createdAt'),
        key: 'createdAt',
        align: 'center',
    },
    {
        title: t('updatedAt'),
        key: 'updatedAt',
        align: 'center',
    },
    {
        title: t('actions'),
        key: 'actions',
        align: 'center',
        sortable: false,
    },
];

const contextMenuItems: ContextMenuItems = [
    {
        title: t('viewQuest'),
        icon: 'mdi-eye',
        action: (item: QuestCollectionItem) => {
            turnOnQuest(item);
        },
    },
    {
        title: t('editQuest'),
        icon: 'mdi-pencil',
        action: (item: QuestCollectionItem) => {
            editQuestItem(item);
        },
    },
    {
        title: t('deleteQuest'),
        icon: 'mdi-delete',
        action: (item: QuestCollectionItem) => {
            console.log('Delete quest', item);
        },
    },
];

const editQuestItem = async (item: QuestCollectionItem) => {
    const toolsStore = useToolsStore();
    const editQuestItemComponent = markRaw(await import('./EditQuestItemTools.vue'));
    const component = editQuestItemComponent.default;
    toolsStore.registerTool({
        id: 'quest-editor-' + item.id,
        name: t('questsEditor') + ' - ' + item.name,
        icon: 'mdi-script-text-key',
        component: component,
        props: {
            width: 1000,
            questItem: item,
        },
    });
};

const turnOnQuest = async (item: QuestCollectionItem) => {
    const toolsStore = useToolsStore();
    const questViewComponent = markRaw(await import('../tools/QuestView.vue'));
    const component = questViewComponent.default;
    toolsStore.registerTool({
        id: 'quest-viewer-' + item.id,
        name: item.name,
        icon: 'mdi-script-text-key',
        component: component,
        props: {
            questItemId: item.id,
            width: item.width || 400,
        },
    });
}

onMounted(async () => {
    loading.value = true;
    await questsStore.loadQuests();
    questsInTable.value = questsStore.quests;
    loading.value = false;
});
</script>
