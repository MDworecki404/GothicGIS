<template>
    <v-card-text>
        <v-skeleton-loader v-if="!questsStore.quests.length" type="article"></v-skeleton-loader>

        <v-text-field
            v-else
            v-model="search"
            :label="$t('search')"
            clearable
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="pb-0 pt-2"
        ></v-text-field>
        <v-treeview
            class="tree"
            density="compact"
            :search="search"
            open-all
            :items="treeItems"
            item-value="id"
            :selectable="false"
            :expand-icon="'mdi-chevron-up'"
            :collapse-icon="'mdi-chevron-down'"
            color="accent"
            :activatable="false"
        >
            <template #append="{ item }">
                <IconButton
                    v-if="!item.children"
                    :icon="'mdi-script-text-play'"
                    variant="text"
                    :tooltip="{
                        position: 'left',
                        text: 'runQuest',
                    }"
                    @click.stop="turnOnQuest(questsStore.quests.find((q) => q.id === item.id)!)"
                ></IconButton>
            </template>
        </v-treeview>
    </v-card-text>
</template>
<script lang="ts" setup>
import { computed, markRaw, onBeforeMount, ref } from 'vue';
import { useQuestsStore } from '../../services/stores/quests';
import IconButton from '../ui/IconButton.vue';
import type { QuestCollectionItem } from '../../services/types/collections';
import { useToolsStore } from '../../services/stores/tools';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const questsStore = useQuestsStore();
const search = ref('');

type TreeChild = {
    id: string;
    title: string;
    type?: 'layer';
};

type TreeParent = {
    id: string;
    title: string;
    type?: 'parent';
    children?: TreeChild[] | TreeParent[];
};

const treeItems = computed((): TreeParent[] => {
    const parents: TreeParent[] = [];

    questsStore.quests.forEach((quest) => {
        if (quest.category) {
            const parent = parents.find((p) => p.id === quest.category);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push({ id: quest.id, title: quest.name });
            } else {
                parents.push({
                    id: quest.category,
                    title: t(quest.category),
                    children: [{ id: quest.id, title: quest.name }],
                });
            }
        } else {
            parents.push({ id: quest.id, title: quest.name });
        }
    });

    return parents;
});

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
};

onBeforeMount(async () => {
    await questsStore.loadQuests();
});
</script>

<style scoped>
.tree {
    user-select: none;
}

.tree :deep(.v-list-item--active > .v-list-item__overlay) {
    opacity: 0;
}

.tree :deep(.v-list-item--active:hover > .v-list-item__overlay) {
    opacity: 0.04;
}
</style>
