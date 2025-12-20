<template>
    <v-card-text class="pa-0 ma-0">
        <v-treeview
            class="tree"
            density="compact"
            :items="treeItems"
            item-value="id"
            selectable
            select-strategy="leaf"
            open-all
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
        </v-treeview>
    </v-card-text>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { performAction } from '../../services/actions';
import { useLayersStore } from '../../services/stores/layers';

const { t } = useI18n();

const layersStore = useLayersStore();

const selectedLayers = ref<string[]>([]);

const initialSelected = layersStore.layers.filter((l: any) => l.show).map((l: any) => l.id);
selectedLayers.value = Array.from(new Set(initialSelected));

watch(
    selectedLayers,
    (newSelected, oldSelected) => {
        const addedLayers = newSelected.filter((id) => !oldSelected.includes(id));
        const removedLayers = oldSelected.filter((id) => !newSelected.includes(id));

        addedLayers.forEach((layerId) => {
            performAction('toggleLayerVisibility', layerId);
        });

        removedLayers.forEach((layerId) => {
            performAction('toggleLayerVisibility', layerId);
        });
    },
    { deep: true }
);

type TreeChild = {
    id: string;
    title: string;
    children?: TreeChild[] | TreeParent[];
};

type TreeParent = {
    id: string;
    title: string;
    children?: TreeChild[] | TreeParent[];
};

const treeItems = computed((): TreeParent[] => {
    const parents: TreeParent[] = [
        {
            id: 'zens',
            title: t('zens'),
            children: [] as TreeChild[],
        },
        {
            id: 'khorinis',
            title: t('khorinis'),
            children: [] as TreeChild[],
        },
    ];

    layersStore.layers.forEach((layer: any) => {
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
</script>

<style scoped>
.tree {
    user-select: none;
}
</style>
