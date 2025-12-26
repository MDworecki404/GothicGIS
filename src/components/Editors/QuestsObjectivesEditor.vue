<template>
    <div>
        <v-row dense no-gutters class="pa-5">
            <TextButton
                prepend-icon="mdi-plus"
                color="accent"
                :text="$t('addObjective')"
                variant="outlined"
                rounded="0"
                @click="addNextStep"
            ></TextButton>
        </v-row>
        <v-stepper-vertical
            v-model="step"
            :hide-actions="true"
            :mandatory="false"
            non-linear
            color="accent"
        >
            <v-stepper-vertical-item
                v-for="st in questCopy?.steps"
                :key="st.step"
                editable
                icon="mdi-script-text-play-outline"
                :edit-icon="'mdi-pencil'"
            >
                <template #title>
                    <span>{{ $t('step') }}: {{ st.step }}</span>
                </template>
                <template #default>
                    <div>
                        <v-row dense no-gutters class="d-flex justify-space-between">
                            <v-text-field
                                v-model="st.title"
                                :label="$t('stepTitle')"
                                variant="outlined"
                                density="compact"
                                @update:model-value="emit('update:quest-item', questCopy!)"
                            ></v-text-field>
                        </v-row>
                        <v-row dense no-gutters>
                            <v-textarea
                                v-model="st.description"
                                :label="$t('stepDescription')"
                                variant="outlined"
                                density="compact"
                                @update:model-value="emit('update:quest-item', questCopy!)"
                            ></v-textarea>
                        </v-row>
                        <v-row dense no-gutters class="mb-5 ga-3">
                            <TextButton
                                :prepend-icon="'mdi-eye'"
                                :text="st.cameraView?.name ? st.cameraView.name : $t('selectView')"
                                :color="st.cameraView ? 'success' : 'accent'"
                                variant="outlined"
                                rounded="0"
                                @click="!st.cameraView ? openViewSelection(st) : removeView(st)"
                            ></TextButton>
                            <IconButton
                                :icon="'mdi-eye-plus'"
                                color="success"
                                icon-color="success"
                                :tooltip="{
                                    position: 'bottom',
                                    text: $t('getActualView'),
                                }"
                                variant="outlined"
                                rounded="0"
                                :size="36"
                                @click="getActualView(st)"
                            ></IconButton>
                            <TextButton
                                :prepend-icon="'mdi-layers-plus'"
                                :text="
                                    st.layersIds?.length
                                        ? st.layersIds.length + ' ' + $t('layersSelected')
                                        : $t('layers')
                                "
                                :color="'primary'"
                                variant="outlined"
                                :tooltip="{
                                    text: $t('selectLayersToShow'),
                                    location: 'bottom',
                                }"
                                rounded="0"
                                @click="openLayersSelection(st)"
                            ></TextButton>
                        </v-row>
                    </div>
                    <v-row dense no-gutters>
                        <IconButton
                            :icon="'mdi-delete'"
                            icon-color="error"
                            color="error"
                            :tooltip="{
                                position: 'right',
                                text: 'deleteStep',
                            }"
                            @click="deleteStep(st.step)"
                        ></IconButton>
                    </v-row>
                </template>
            </v-stepper-vertical-item>
        </v-stepper-vertical>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { markRaw, onMounted, ref, watch } from 'vue';
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';
import type { QuestCollectionItem, ViewConfigItem } from '../../services/types/collections';
import TextButton from '../ui/TextButton.vue';
import { getDefaultStepConfig } from '../../services/defaults';
import IconButton from '../ui/IconButton.vue';
import { useDialogStore } from '../../services/stores/dialog';
import { useLayersStore } from '../../services/stores/layers';
import { globeInstance } from '../../services/globe/globe';

const questCopy = ref<QuestCollectionItem>();

const addNextStep = () => {
    if (!questCopy.value) return;
    const nextStepNumber = questCopy.value.steps.length + 1;
    questCopy.value.steps.push(getDefaultStepConfig(nextStepNumber));

    questCopy.value.steps.forEach((s, index) => {
        s.step = index + 1;
    });

    emit('update:quest-item', questCopy.value!);
};

const deleteStep = (stepNumber: number) => {
    if (!questCopy.value) return;
    questCopy.value.steps = questCopy.value.steps.filter((s) => s.step !== stepNumber);

    questCopy.value.steps.forEach((s, index) => {
        s.step = index + 1;
    });

    emit('update:quest-item', questCopy.value!);
};

const step = ref<number>(1);

const { questItem } = defineProps<{
    questItem: QuestCollectionItem;
}>();

const emit = defineEmits<{
    (e: 'update:quest-item', value: QuestCollectionItem): void;
}>();

onMounted(() => {
    questCopy.value = cloneDeep(questItem);
});

watch(
    () => questCopy.value,
    (newVal) => {
        if (newVal) {
            emit('update:quest-item', newVal);
        }
    }
);

const openViewSelection = async (questItemStep: QuestCollectionItem['steps'][number]) => {
    const dialogStore = useDialogStore();
    const viewsSelectComponent = markRaw(await import('./SelectFromCollections.vue'));
    const component = viewsSelectComponent.default;
    dialogStore.showDialog({
        component: component,
        props: {
            collectionId: 'views',
            selectItemCallback: (item: ViewConfigItem) => {
                dialogStore.closeDialog();
                questItemStep.cameraView = item;
                emit('update:quest-item', questCopy.value!);
            },
        },
        dialogStyle: {
            width: 600,
        },
    });
};

const openLayersSelection = async (questItemStep: QuestCollectionItem['steps'][number]) => {
    const layers = useLayersStore().layers;

    const dialogStore = useDialogStore();
    const itemsSelectComponent = markRaw(await import('../tools/ItemsSelector.vue'));
    const component = itemsSelectComponent.default;
    dialogStore.showDialog({
        component: component,
        props: {
            items: layers,
            title: 'selectLayersToShowInStep',
            selectedCallback: (selectedItems: string[]) => {
                dialogStore.closeDialog();
                questItemStep.layersIds = selectedItems;
                emit('update:quest-item', questCopy.value!);
            },
            alreadySelectedItems: questItemStep.layersIds || [],
        },
        dialogStyle: {
            width: 600,
        },
    });
};

const getActualView = (questItemStep: QuestCollectionItem['steps'][number]) => {
    const X = globeInstance?.viewer?.scene.camera.position.x ?? 0;
    const Y = globeInstance?.viewer?.scene.camera.position.y ?? 0;
    const Z = globeInstance?.viewer?.scene.camera.position.z ?? 0;

    const heading = globeInstance?.viewer?.scene.camera.heading ?? 0;
    const pitch = globeInstance?.viewer?.scene.camera.pitch ?? 0;

    const config: ViewConfigItem = {
        id: crypto.randomUUID(),
        name: questItemStep.title || 'Unnamed View',
        view: {
            x: X,
            y: Y,
            z: Z,
            heading: heading,
            pitch: pitch,
        },
    };

    questItemStep.cameraView = config;
    emit('update:quest-item', questCopy.value!);
};

const removeView = (questItemStep: QuestCollectionItem['steps'][number]) => {
    delete questItemStep.cameraView;
    emit('update:quest-item', questCopy.value!);
};
</script>
