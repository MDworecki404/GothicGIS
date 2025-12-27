<template>
    <v-card-text>
        <v-row dense no-gutters justify="center" class="ga-5 mt-5">
            <IconButton
                icon="mdi-ruler"
                :tooltip="{
                    position: 'left',
                    text: 'distance',
                }"
                :size="42"
                :icon-size="28"
                :disabled="
                    selectedMeasurementMode !== undefined && selectedMeasurementMode !== 'distance'
                "
                @click="selectMeasurementMode('distance')"
            ></IconButton>
            <IconButton
                icon="mdi-vector-polygon-variant"
                :tooltip="{
                    position: 'bottom',
                    text: 'area',
                }"
                :size="42"
                :icon-size="28"
                :disabled="
                    selectedMeasurementMode !== undefined && selectedMeasurementMode !== 'area'
                "
                @click="selectMeasurementMode('area')"
            ></IconButton>
            <IconButton
                icon="mdi-human-male-height-variant"
                :tooltip="{
                    position: 'right',
                    text: 'height',
                }"
                :size="42"
                :icon-size="28"
                :disabled="
                    selectedMeasurementMode !== undefined && selectedMeasurementMode !== 'height'
                "
                @click="selectMeasurementMode('height')"
            ></IconButton>
        </v-row>
        <v-slide-y-transition>
            <v-row v-if="selectedMeasurementMode" dense no-gutters class="mt-2" justify="center" align="center">
                <v-divider class="my-4"></v-divider>
                <TextButton
                    prepend-icon="mdi-restart-alert"
                    :text="$t('reset')"
                    :color="'primary'"
                    rounded="0"
                    variant="outlined"
                    class="mr-2"
                    @click="resetMeasurement"
                ></TextButton>
                <TextButton
                    prepend-icon="mdi-check"
                    :text="$t('finishMeasurement')"
                    :color="'success'"
                    rounded="0"
                    variant="outlined"
                    class="ml-2"
                    @click="finishMeasure"
                ></TextButton>
            </v-row>
        </v-slide-y-transition>
        <v-divider class="my-4"></v-divider>
        <v-row dense no-gutters class="mt-2" justify="center" align="center">
            <TextButton
                prepend-icon="mdi-cancel"
                :text="$t('clearMeasurements')"
                :color="'error'"
                rounded="0"
                variant="outlined"
                @click="eraseMeasurements"
            ></TextButton>
        </v-row>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import { globeInstance } from '../../services/globe/globe';
import IconButton from '../ui/IconButton.vue';
import TextButton from '../ui/TextButton.vue';

const selectedMeasurementMode = ref<'distance' | 'area' | 'height'>();

const selectMeasurementMode = (mode: 'distance' | 'area' | 'height') => {
    selectedMeasurementMode.value = mode;

    globeInstance?.measurement.selectMeasurementMode(mode);
};

const resetMeasurement = () => {
    globeInstance?.measurement.clearTemporaryLayer();
};

const finishMeasure = () => {
    selectedMeasurementMode.value = undefined;
    globeInstance?.measurement.finishMeasurement();
};

const eraseMeasurements = () => {
    selectedMeasurementMode.value = undefined;
    globeInstance?.measurement.clearMeasurementLayer();
    globeInstance?.measurement.clearTemporaryLayer();
    globeInstance?.measurement.finishMeasurement();
};

onUnmounted(() => {
    globeInstance?.measurement.finishMeasurement();
});
</script>
