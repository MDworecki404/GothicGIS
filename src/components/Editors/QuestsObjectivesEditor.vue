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
                            ></v-text-field>
                        </v-row>
                        <v-row dense no-gutters>
                            <v-textarea
                                v-model="st.description"
                                :label="$t('stepDescription')"
                                variant="outlined"
                                density="compact"
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
                            <TextButton
                                :prepend-icon="'mdi-layers-plus'"
                                :text="
                                    st.layersIds?.length
                                        ? st.layersIds.length + ' ' + $t('layersSelected')
                                        : $t('selectLayersToShow')
                                "
                                :color="'primary'"
                                variant="outlined"
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
                                text: 'deleteStep'
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

const questCopy = ref<QuestCollectionItem>();

const addNextStep = () => {
    if (!questCopy.value) return;
    const nextStepNumber = questCopy.value.steps.length + 1;
    questCopy.value.steps.push(getDefaultStepConfig(nextStepNumber));

    questCopy.value.steps.forEach((s, index) => {
        s.step = index + 1;
    });
};

const deleteStep = (stepNumber: number) => {
    if (!questCopy.value) return;
    questCopy.value.steps = questCopy.value.steps.filter((s) => s.step !== stepNumber);

    questCopy.value.steps.forEach((s, index) => {
        s.step = index + 1;
    });
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
            },
            alreadySelectedItems: questItemStep.layersIds || []
        },
        dialogStyle: {
            width: 600,
        },
    });
};

const removeView = (questItemStep: QuestCollectionItem['steps'][number]) => {
    delete questItemStep.cameraView;
};
</script>
