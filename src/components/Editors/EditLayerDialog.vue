<template>
    <div>
        <v-tabs v-model="tab">
            <v-tab value="graphicEditor">{{ $t('graphicEditor') }}</v-tab>
            <v-tab value="jsonEditor"> {{ $t('jsonEditor') }} </v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="graphicEditor">
                <span class="text-button">{{ $t('metadata') }}:</span>
                <v-row dense no-gutters class="pt-3 ga-5">
                    <v-text-field
                        v-model="layerConfig!.id"
                        :label="$t('id')"
                        variant="outlined"
                        prepend-inner-icon="mdi-identifier"
                        color="accent"
                    ></v-text-field>
                    <v-text-field
                        v-model="layerConfig!.name"
                        :label="$t('name')"
                        variant="outlined"
                        prepend-inner-icon="mdi-format-title"
                        color="accent"
                    ></v-text-field>
                </v-row>
                <span class="text-button">{{ $t('configuration') }}:</span>
                <v-row dense no-gutters class="pt-3 ga-5">
                    <v-checkbox
                        v-model="layerConfig!.show"
                        :label="$t('visibleAtStart')"
                        class="ma-0 pa-0"
                        color="accent"
                    ></v-checkbox>
                    <v-select
                        v-model="layerConfig!.type"
                        :items="LayerTypes"
                        :label="$t('layerType')"
                        variant="outlined"
                        prepend-inner-icon="mdi-layers-triple"
                        color="accent"
                    ></v-select>
                </v-row>
                <v-row dense no-gutters class="pt-3 ga-5">
                    <v-text-field
                        v-model="layerConfig!.parentId"
                        :label="$t('parentId')"
                        variant="outlined"
                        prepend-inner-icon="mdi-file-tree-outline"
                        color="accent"
                    ></v-text-field>
                    <v-text-field
                        v-model="layerConfig!.resource.ionId"
                        :label="$t('ionId')"
                        variant="outlined"
                        prepend-inner-icon="mdi-identifier"
                        color="accent"
                    ></v-text-field>
                </v-row>
            </v-tabs-window-item>
            <v-tabs-window-item value="jsonEditor">
                <j-s-o-n-editor
                    :code="JSON.stringify(layerConfig, null, 2)"
                    :disable-save-btn="true"
                    @update:code="layerConfig = JSON.parse($event)"
                ></j-s-o-n-editor>
            </v-tabs-window-item>
        </v-tabs-window>

        <v-row dense no-gutters justify="end">
            <TextButton
                :text="$t('save')"
                prepend-icon="mdi-content-save"
                color="success"
                :disabled="disabledSaveButton"
                @click="triggerSaveLayer"
            ></TextButton>
        </v-row>
    </div>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { computed, onBeforeMount, ref } from 'vue';
import { useDialogStore } from '../../services/stores/dialog';
import { useLayersStore } from '../../services/stores/layers';
import type { LayerCollectionItem } from '../../services/types/collections';
import { LayerTypes } from '../../services/types/collections';
import JSONEditor from '../ui/JSONEditor.vue';
import TextButton from '../ui/TextButton.vue';

const { layerItem } = defineProps<{
    layerItem: LayerCollectionItem;
}>();

const disabledSaveButton = computed(() => {
    return layerConfig.value!.name.length < 2 || layerConfig.value!.id.length < 1;
});

const tab = ref('graphicEditor');

const layerConfig = ref<LayerCollectionItem | null>(null);

const originalId = ref<string | null>(null);

const triggerSaveLayer = () => {
    useLayersStore().saveLayerConfig(layerConfig.value!, originalId.value ?? undefined);
    useDialogStore().closeDialog();
};

onBeforeMount(() => {
    layerConfig.value = cloneDeep(layerItem);
    originalId.value = layerItem.id;
});
</script>
