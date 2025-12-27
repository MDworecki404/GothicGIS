<template>
    <v-card-text>
        <v-row dense no-gutters class="mt-5 ga-2" justify="center">
            <TextButton
                prepend-icon="mdi-vector-point"
                variant="outlined"
                rounded="0"
                color="accent"
                :disabled="selectedDrawMode !== null && selectedDrawMode !== 'point'"
                :text="$t('drawPoint')"
                @click="selectDrawMode('point')"
            />
            <TextButton
                prepend-icon="mdi-vector-line"
                variant="outlined"
                rounded="0"
                color="accent"
                :disabled="selectedDrawMode !== null && selectedDrawMode !== 'line'"
                :text="$t('drawLine')"
                @click="selectDrawMode('line')"
            />
            <TextButton
                prepend-icon="mdi-vector-polygon"
                variant="outlined"
                rounded="0"
                color="accent"
                :disabled="selectedDrawMode !== null && selectedDrawMode !== 'polygon'"
                :text="$t('drawPolygon')"
                @click="selectDrawMode('polygon')"
            />
        </v-row>
        <v-slide-y-transition>
            <v-row
                v-if="selectedDrawMode !== null"
                dense
                no-gutters
                class="mt-2"
                justify="center"
            >
                <v-divider v-if="selectedDrawMode !== null" class="my-4" />

                <TextButton
                    prepend-icon="mdi-restart-alert"
                    variant="outlined"
                    rounded="0"
                    class="mr-2"
                    color="primary"
                    :text="$t('reset')"
                    @click="resetDrawing"
                />
                <TextButton
                    prepend-icon="mdi-check"
                    variant="outlined"
                    rounded="0"
                    class="ml-2"
                    color="success"
                    :text="$t('finishDrawing')"
                    @click="finishDrawing"
                />
            </v-row>
        </v-slide-y-transition>
        <v-divider class="my-4" />
        <v-row dense no-gutters class="mt-2" justify="center">
            <TextButton
                prepend-icon="mdi-eraser"
                variant="outlined"
                rounded="0"
                color="error"
                :text="$t('eraseDrawing')"
                @click="eraseDrawing"
            />
        </v-row>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import TextButton from '../ui/TextButton.vue';
import { globeInstance } from '../../services/globe/globe';

const selectedDrawMode = ref<'point' | 'line' | 'polygon' | null>(null);

const selectDrawMode = (mode: 'point' | 'line' | 'polygon' | null) => {
    selectedDrawMode.value = mode;

    globeInstance?.draw.selectDrawMode(mode)
};

const resetDrawing = () => {
    globeInstance?.draw.clearTemporaryLayer();
};

const finishDrawing = () => {
    selectedDrawMode.value = null;
    globeInstance?.draw.finishDrawing();
}

const eraseDrawing = () => {
    selectedDrawMode.value = null;
    globeInstance?.draw.clearDrawLayer();
    globeInstance?.draw.clearTemporaryLayer();
    globeInstance?.draw.finishDrawing();
}

onUnmounted(() => {
    globeInstance?.draw.finishDrawing();
});
</script>
