<template>
    <v-card-text class="pa-2">
        <v-row dense no-gutters>
            <span>{{$t("X")}}: {{ X }}</span>
        </v-row>
        <v-row dense no-gutters>
            <span>{{$t("Y")}}: {{ Y }}</span>
        </v-row>
        <v-row dense no-gutters>
            <span>{{$t("Z")}}: {{ Z }}</span>
        </v-row>

        <v-divider class="my-2"></v-divider>

        <v-row dense no-gutters>
            <span>{{$t("Heading")}}: {{ heading }}</span>
        </v-row>
        <v-row dense no-gutters>
            <span>{{$t("Pitch")}}: {{ pitch }}</span>
        </v-row>

        <v-divider class="my-2"></v-divider>

        <v-row dense no-gutters>
            <v-text-field
                v-model="newViewName"
                class="mt-3"
                :label="$t('viewName')"
                variant="outlined"
                density="compact"
                ></v-text-field>
        </v-row>

        <v-row dense no-gutters justify="end">
            <TextButton
                color="accent"
                prepend-icon="mdi-camera-plus"
                :text="$t('saveCurrentView')"
                :disabled="newViewName.length < 3"
                @click="triggerSaveView"
            ></TextButton>
        </v-row>
    </v-card-text>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { globeInstance } from '../../services/globe/globe';
import TextButton from '../ui/TextButton.vue';
import type { ViewConfigItem } from '../../services/types/collections';
import { useViewsStore } from '../../services/stores/views';

const newViewName = ref('');

const X = ref(0);
const Y = ref(0);
const Z = ref(0);

const heading = ref(0);
const pitch = ref(0);
const roll = ref(0);

const updatePosition = () => {
    X.value = globeInstance?.viewer?.scene.camera.position.x ?? 0;
    Y.value = globeInstance?.viewer?.scene.camera.position.y ?? 0;
    Z.value = globeInstance?.viewer?.scene.camera.position.z ?? 0;

    heading.value = globeInstance?.viewer?.scene.camera.heading ?? 0;
    pitch.value = globeInstance?.viewer?.scene.camera.pitch ?? 0;
    roll.value = globeInstance?.viewer?.scene.camera.roll ?? 0;
};

const triggerSaveView = async () => {
    const config: ViewConfigItem = {
        id: crypto.randomUUID(),
        name: newViewName.value,
        view: {
            x: X.value,
            y: Y.value,
            z: Z.value,
            heading: heading.value,
            pitch: pitch.value,
        }
    }

    const viewsStore = useViewsStore()

    await viewsStore.saveViewConfig(config, config.id).then(() => {
        newViewName.value = '';
    });
}

onMounted(() => {
    updatePosition();

    globeInstance?.viewer?.scene.camera.changed.addEventListener(() => {
        updatePosition();
    });
});
</script>
