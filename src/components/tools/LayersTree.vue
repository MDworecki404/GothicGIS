<template>
    <v-card-text class="pa-0 ma-0">
        <v-treeview
            class="tree"
            density="compact"
            :items="treeItems"
            item-value="id"
            selectable
            select-strategy="classic"
            v-model:selected="selectedLayers"
            :expand-icon="'mdi-chevron-up'"
            :collapse-icon="'mdi-chevron-down'"
            color="accent"
        >
            <template #toggle="{ isOpen }">
                <v-icon color="accent" size="20">
                    {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
            </template>
            <template #append="{ item }">
                <context-menu
                    v-if="!item.children"
                    :context-menu-items="contextMenuItems"
                    :prop-item="layersStore.layers.find((layer) => layer.id === item.id)"
                ></context-menu>
            </template>
        </v-treeview>
    </v-card-text>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { performAction } from '../../services/actions';
import { globeInstance } from '../../services/globe/globe';
import { questsEvent } from '../../services/quests';
import { useLayersStore } from '../../services/stores/layers';
import type { LayerCollectionItem } from '../../services/types/collections';
import type { ContextMenuItems } from '../../services/types/ui';
import { zoomToLayer } from '../../services/utils';
import ContextMenu from '../ui/ContextMenu.vue';

const { t } = useI18n();
const listenersRemovers: (() => void)[] = [];

const layersStore = useLayersStore();

const selectedLayers = ref<string[]>([]);

const suppressSelectedWatch = ref(false);

watch(selectedLayers, (newSelected, oldSelected) => {
    if (suppressSelectedWatch.value) return;

    const addedLayers = newSelected.filter((id) => !oldSelected.includes(id));
    const removedLayers = oldSelected.filter((id) => !newSelected.includes(id));

    addedLayers.forEach((layerId) => performAction('toggleLayerVisibility', layerId));
    removedLayers.forEach((layerId) => performAction('toggleLayerVisibility', layerId));
});

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

    layersStore.layers.forEach((layer: LayerCollectionItem) => {
        if (layersStore.invalidateLayers.has(layer.id)) {
            return;
        }
        if (layer.parentId) {
            const parent = parents.find((p) => p.id === layer.parentId);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push({ id: layer.id, title: layer.name });
            } else {
                parents.push({
                    id: layer.parentId,
                    title: layer.parentId,
                    children: [{ id: layer.id, title: layer.name }],
                });
            }
        } else {
            parents.push({ id: layer.id, title: layer.name });
        }
    });

    return parents;
});

onMounted(() => {
    const listener = questsEvent.addEventListener(() => {
        suppressSelectedWatch.value = true;
        selectedLayers.value = [];
        globeInstance?.layers.layers.forEach((layer) => {
            if (layer.show) {
                selectedLayers.value.push(layer.appId!);
            }
        });
        suppressSelectedWatch.value = false;
    });
    listenersRemovers.push(listener);

    suppressSelectedWatch.value = true;
    globeInstance?.layers.layers.forEach((layer) => {
        if (layer.show) {
            selectedLayers.value.push(layer.appId!);
        }
    });
    suppressSelectedWatch.value = false;
});

onUnmounted(() => {
    listenersRemovers.forEach((remove) => remove());
});

const contextMenuItems: ContextMenuItems = [
    {
        title: t('zoomTo'),
        icon: 'mdi-magnify',
        action: (item: LayerCollectionItem) => {
            zoomToLayer(item.id);
        },
    },
    {
        title: t('transform'),
        icon: 'mdi-axis-arrow',
        action: (item: LayerCollectionItem) => {
            performAction('toggleLayerTransformerTool', item);
        },
    },
];
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
