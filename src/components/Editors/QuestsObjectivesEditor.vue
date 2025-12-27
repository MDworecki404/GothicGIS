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
                        <v-tabs v-model="objectivesTab" color="accent">
                            <v-tab value="viewsAndLayers">{{ $t('viewsAndLayers') }}</v-tab>
                            <v-tab value="drawings">{{ $t('drawings') }}</v-tab>
                        </v-tabs>
                        <v-tabs-window v-model="objectivesTab" class="pt-5">
                            <v-tabs-window-item value="viewsAndLayers">
                                <v-row dense no-gutters class="mb-5 ga-3">
                                    <TextButton
                                        :prepend-icon="'mdi-eye'"
                                        :text="
                                            truncate(
                                                st.cameraView?.name
                                                    ? st.cameraView.name
                                                    : $t('selectView'),
                                                {
                                                    length: 25,
                                                }
                                            )
                                        "
                                        :color="st.cameraView ? 'success' : 'accent'"
                                        variant="outlined"
                                        rounded="0"
                                        @click="
                                            !st.cameraView ? openViewSelection(st) : removeView(st)
                                        "
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
                            </v-tabs-window-item>

                            <v-tabs-window-item value="drawings">
                                <DrawingTools
                                    @drawing-erased="onDrawingErased(st)"
                                    @drawing-finished="onDrawingFinished(st)"
                                />
                            </v-tabs-window-item>
                        </v-tabs-window>
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
import type { Cartesian3 } from 'cesium';
import { CustomDataSource, Entity } from 'cesium';
import { cloneDeep, truncate } from 'lodash';
import { markRaw, onMounted, onUnmounted, ref, watch } from 'vue';
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';
import { getDefaultStepConfig } from '../../services/defaults';
import { globeInstance } from '../../services/globe/globe';
import { useDialogStore } from '../../services/stores/dialog';
import { useLayersStore } from '../../services/stores/layers';
import type { QuestCollectionItem, ViewConfigItem } from '../../services/types/collections';
import DrawingTools from '../tools/DrawingTools.vue';
import IconButton from '../ui/IconButton.vue';
import TextButton from '../ui/TextButton.vue';

//TODO: FIX DRAWINGS IDS ISSUE WHEN DELETING AND ADDING STEPS

const questCopy = ref<QuestCollectionItem>();
const objectivesTab = ref<string>('viewsAndLayers');

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

    const idsToRemove = questDataSource.entities.values
        .filter(
            (entity) => typeof entity.id === 'string' && entity.id.startsWith(`step-${stepNumber}-`)
        )
        .map((entity) => entity.id as string);
    idsToRemove.forEach((id) => questDataSource.entities.removeById(id));

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

const questDataSource = new CustomDataSource('questObjectivesDataSource');
globeInstance?.viewer?.dataSources.add(questDataSource);

const onDrawingFinished = (questItemStep: QuestCollectionItem['steps'][number]) => {
    const entities = globeInstance?.draw.drawLayer?.entities;
    if (!entities) return;
    entities.values.forEach((entity) => {
        const entityToCopy = new Entity({
            id: `step-${questItemStep.step}-${entity.id}`,
            position: entity.position,
            point: entity.point,
            polyline: entity.polyline,
            polygon: entity.polygon,
            properties: entity.properties,
            name: entity.name,
        });
        questDataSource.entities.add(entityToCopy);
    });
    globeInstance?.draw.clearDrawLayer();

    const stepPrefix = `step-${questItemStep.step}-`;
    const existingIds = new Set((questItemStep.drawings || []).map((d) => d.id));
    questDataSource.entities.values
        .filter((entity) => typeof entity.id === 'string' && entity.id.startsWith(stepPrefix))
        .forEach((entity) => {
            if (existingIds.has(entity.id as string)) return;
            if (!questItemStep.drawings) {
                questItemStep.drawings = [];
            }

            if (entity.point) {
                questItemStep.drawings!.push({
                    type: 'point',
                    id: entity.id,
                    positions: [
                        {
                            x: entity.position!.getValue()!.x,
                            y: entity.position!.getValue()!.y,
                            z: entity.position!.getValue()!.z,
                        },
                    ],
                });
                return;
            }

            if (entity.polyline) {
                questItemStep.drawings!.push({
                    type: 'polyline',
                    id: entity.id,
                    positions: entity.polyline.positions!.getValue().map((pos: Cartesian3) => ({
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                    })),
                });
                return;
            }

            if (entity.polygon) {
                questItemStep.drawings!.push({
                    type: 'polygon',
                    id: entity.id,
                    positions: entity.polygon
                        .hierarchy!.getValue()
                        .positions.map((pos: Cartesian3) => ({
                            x: pos.x,
                            y: pos.y,
                            z: pos.z,
                        })),
                });
                return;
            }
        });

    emit('update:quest-item', questCopy.value!);
};

const onDrawingErased = (questItemStep: QuestCollectionItem['steps'][number]) => {
    questDataSource.entities.removeAll();

    questItemStep.drawings = [];
    emit('update:quest-item', questCopy.value!);
};

onMounted(() => {
    questCopy.value = cloneDeep(questItem);
});

onUnmounted(() => {
    globeInstance?.viewer?.dataSources.remove(questDataSource);
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
