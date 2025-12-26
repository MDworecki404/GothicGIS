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
            ></v-number-input>
        </v-row>
        <v-row dense no-gutters class="mt-4">
            <span class="text-button">{{ $t('scale') }}:</span>
        </v-row>
        <v-row dense no-gutters class="mt-2 ga-5">
            <v-number-input
                v-model="layerCopy!.transformation!.scale"
                density="compact"
                hide-details
                :step="0.001"
                :precision="3"
                variant="outlined"
                :control-variant="'stacked'"
                :label="$t('scale')"
            ></v-number-input>
        </v-row>
        <v-row dense no-gutters class="mt-4" justify="end">
            <TextButton
                :text="$t('saveToLayer')"
                :prepend-icon="'mdi-content-save'"
                color="accent"
            ></TextButton>
        </v-row>
    </v-card-text>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { ref } from 'vue';
import { getDefaultLayerTransformation } from '../../services/defaults';
import type { LayerCollectionItem } from '../../services/types/collections';
import TextButton from '../ui/TextButton.vue';

const { props } = defineProps<{
    props: { layerItem: LayerCollectionItem };
}>();

const layerCopy = ref<LayerCollectionItem | null>(null);

const source = cloneDeep(props.layerItem);
if (!source.transformation) {
    source.transformation = getDefaultLayerTransformation();
}
layerCopy.value = source;
</script>
