<template>
    <v-card-text>
        <v-pagination
            v-model="actualStep"
            :length="questConfig?.steps.length"
            @update:model-value="onStepChange"
            color="accent"
            rounded
            density="compact"
        ></v-pagination>
        <div class="text-subtitle-1">
            <v-row dense no-gutters class="font-weight-bold text-button">{{ questConfig?.steps[actualStep - 1]?.title }}</v-row>
            <v-divider class="my-2"></v-divider>
            {{ questConfig?.steps[actualStep - 1]?.description }}
        </div>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useQuestsStore } from '../../services/stores/quests';
import { type QuestCollectionItem } from '../../services/types/collections';
import { zoomToViewConfig } from '../../services/utils';

const { props } = defineProps<{
    props: { questItemId: string };
}>();

const questConfig = ref<QuestCollectionItem | null>(null);
const actualStep = ref(1);

const onStepChange = () => {
    const currentStep = questConfig.value?.steps[actualStep.value - 1];
    if (currentStep && currentStep.cameraView) {
        zoomToViewConfig(currentStep.cameraView, 1.5);
    }
};

onMounted(async () => {
    const questsStore = useQuestsStore();
    await questsStore.loadQuests();
    questConfig.value = questsStore.quests.find((q) => q.id === props.questItemId) || null;

    onStepChange();
});
</script>
