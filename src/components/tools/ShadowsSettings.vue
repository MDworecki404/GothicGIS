<template>
    <v-card-text class="pa-0 ma-0 pl-5 pr-5">
        <v-row dense no-gutters>
            <v-checkbox
                color="accent"
                density="compact"
                hide-details
                :label="$t('shadows')"
                v-model="shadowsEnabled"
                @change="onShadowsToggle"
            ></v-checkbox>
        </v-row>
        <v-row dense no-gutters>
            <v-checkbox
                color="accent"
                density="compact"
                hide-details
                :label="$t('softShadows')"
                v-model="softShadowsEnabled"
                :disabled="!shadowsEnabled"
                @change="onSoftShadowsToggle"
            ></v-checkbox>
        </v-row>
        <v-divider></v-divider>
        <v-row dense no-gutters>
            <v-slider
                v-model="timeOfDay"
                :min="0"
                :max="1439"
                :label="$t('timeOfDay')"
                color="accent"
                thumb-size="12"
                track-size="4"
                hide-details="auto"
                class="pt-7 pb-5"
                :step="1"
                thumb-label="always"
                @update:model-value="onTimeOfDayChange"
            >
                <template #thumb-label="{ modelValue }">
                    {{
                        Math.floor(modelValue / 60)
                            .toString()
                            .padStart(2, '0')
                    }}:{{ (modelValue % 60).toString().padStart(2, '0') }}
                </template>
            </v-slider>
        </v-row>
    </v-card-text>
    <v-card-actions class="justify-end">
        <TextButton
            :text="$t('setDefaultTime')"
            color="accent"
            :prepend-icon="'mdi-refresh-circle'"
            @click="triggerSetDefaultTimeOfDay"
        ></TextButton>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { JulianDate } from '@cesium/engine';
import { onBeforeMount, ref } from 'vue';
import { globeInstance } from '../../services/globe/globe';
import TextButton from '../ui/TextButton.vue';
import { setDefaultTimeOfDay } from '../../services/utils';

const shadowsEnabled = ref(false);
const timeOfDay = ref(12 * 60);
const softShadowsEnabled = ref(true);

const onSoftShadowsToggle = () => {
    const viewer = globeInstance?.viewer;
    if (viewer) {
        viewer.shadows = false;
        viewer.shadows = shadowsEnabled.value;
        viewer.shadowMap.softShadows = softShadowsEnabled.value;
    }
};

const triggerSetDefaultTimeOfDay = () => {
    setDefaultTimeOfDay();
    const viewer = globeInstance?.viewer;
    if (viewer) {
        const currentDate = JulianDate.toDate(viewer.clock.currentTime!);
        timeOfDay.value = currentDate.getHours() * 60 + currentDate.getMinutes();
    }
};

const onShadowsToggle = () => {
    const viewer = globeInstance?.viewer;
    if (viewer) {
        viewer.shadows = shadowsEnabled.value;
    }
};

const onTimeOfDayChange = () => {
    const viewer = globeInstance?.viewer;
    if (viewer) {
        const hours = Math.floor(timeOfDay.value / 60);
        const minutes = timeOfDay.value % 60;
        const currentDate = JulianDate.toDate(viewer.clock.currentTime!);
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        const newJulianDate = JulianDate.fromDate(currentDate);
        viewer.clock.currentTime = newJulianDate;
    }
};

onBeforeMount(() => {
    const viewer = globeInstance?.viewer;
    if (viewer) {
        shadowsEnabled.value = viewer.shadows;
        timeOfDay.value =
            JulianDate.toDate(globeInstance?.viewer?.clock.currentTime!).getHours() * 60 +
            JulianDate.toDate(globeInstance?.viewer?.clock.currentTime!).getMinutes();
    }
});
</script>
