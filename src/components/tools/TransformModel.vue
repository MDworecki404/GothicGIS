<template>
    <v-card-text>
        <v-row dense no-gutters>
            <span class="text-button">{{ $t('xyzTranslation') }}:</span>
        </v-row>
        <v-row dense no-gutters class="mt-2 ga-5">
            <v-number-input
                v-model="layerCopy!.transformation!.translate!.x"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                label="X"
                @update:model-value="onValuesChange"
            ></v-number-input>
            <v-number-input
                v-model="layerCopy!.transformation!.translate!.y"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                label="Y"
                @update:model-value="onValuesChange"
            ></v-number-input>
            <v-number-input
                v-model="layerCopy!.transformation!.translate!.z"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                label="Z"
                @update:model-value="onValuesChange"
            ></v-number-input>
        </v-row>
        <v-row dense no-gutters class="mt-4">
            <span class="text-button">{{ $t('rotation') }}:</span>
        </v-row>
        <v-row dense no-gutters class="mt-2 ga-5">
            <v-number-input
                v-model="layerCopy!.transformation!.rotate!.heading"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                :label="$t('headingDegrees')"
                @update:model-value="onValuesChange"
            ></v-number-input>
            <v-number-input
                v-model="layerCopy!.transformation!.rotate!.pitch"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                :label="$t('pitchDegrees')"
                @update:model-value="onValuesChange"
            ></v-number-input>
            <v-number-input
                v-model="layerCopy!.transformation!.rotate!.roll"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                :label="$t('rollDegrees')"
                @update:model-value="onValuesChange"
            ></v-number-input>
        </v-row>
        <v-row dense no-gutters class="mt-4">
            <span class="text-button">{{ $t('scale') }}:</span>
        </v-row>
        <v-row dense no-gutters class="mt-2 ga-5">
            <v-number-input
                v-model="layerCopy!.transformation!.scale"
                density="compact"
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                :label="$t('scale')"
                @update:model-value="onValuesChange"
            ></v-number-input>
        </v-row>
        <v-row dense no-gutters class="mt-4" justify="end">
            <TextButton
                v-if="useUserStore().hasRole('admin') || useUserStore().hasRole('editor')"
                :text="$t('saveToLayer')"
                :prepend-icon="'mdi-content-save'"
                color="accent"
                :loading="loading"
                @click="triggerLayerUpdate"
            ></TextButton>
        </v-row>
    </v-card-text>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { onUnmounted, ref } from 'vue';
import { getDefaultLayerTransformation } from '../../services/defaults';
import { globeInstance } from '../../services/globe/globe';
import { useLayersStore } from '../../services/stores/layers';
import { useUserStore } from '../../services/stores/user';
import type { LayerCollectionItem } from '../../services/types/collections';
import TextButton from '../ui/TextButton.vue';

const { props } = defineProps<{
    props: { layerItem: LayerCollectionItem };
}>();

const loading = ref(false);

const layerCopy = ref<LayerCollectionItem | null>(null);

const source = cloneDeep(props.layerItem);
if (!source.transformation) {
    source.transformation = getDefaultLayerTransformation();
}
layerCopy.value = source;

const onValuesChange = () => {
    if (!layerCopy.value) return;
    globeInstance?.layers.transformLayerCoordinates({
        layerId: layerCopy.value.id,
        parameters: layerCopy.value.transformation,
    });
};

onUnmounted(() => {
    useLayersStore().layersMap.get(props.layerItem.id)!.transformation = layerCopy.value?.transformation;
})

const triggerLayerUpdate = async () => {
    if (!layerCopy.value) return;
    loading.value = true;
    await useLayersStore().updateLayer(layerCopy.value);
    loading.value = false;
};
</script>
