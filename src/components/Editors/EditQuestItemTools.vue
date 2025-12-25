<template>
    <div>
        <v-card-text>
            <v-row dense no-gutters justify="center">
                <v-tabs v-model="tab" color="accent">
                    <v-tab value="metadata">{{ $t('metadata') }}</v-tab>
                    <v-tab value="objectives">{{ $t('objectives') }}</v-tab>
                    <v-tab value="jsonEditor">{{ $t('jsonEditor') }}</v-tab>
                </v-tabs>
            </v-row>
            <v-divider></v-divider>
            <v-tabs-window v-model="tab" class="mt-4" v-if="questConfig">
                <v-tabs-window-item value="metadata">
                    <QuestMetadataEditor
                        :quest-item="questConfig"
                        @update:quest-item="(item) => (questConfig = item)"
                    />
                </v-tabs-window-item>
                <v-tabs-window-item value="objectives">
                    <QuestsObjectivesEditor
                        :quest-item="questConfig"
                        @update:quest-item="(item) => (questConfig = item)"
                    />
                </v-tabs-window-item>
                <v-tabs-window-item value="jsonEditor">
                    <JSONEditor
                        :code="JSON.stringify(questConfig, null, 2)"
                        :width="1000"
                        :disable-save-btn="true"
                        @update:code="(code) => (questConfig = JSON.parse(code))"
                    ></JSONEditor>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
            <TextButton
                :prepend-icon="'mdi-content-save'"
                :text="$t('save')"
                color="accent"
                size="large"
                :loading="loading"
                @click="triggerSaveConfig"
            ></TextButton>
        </v-card-actions>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import type { QuestCollectionItem } from '../../services/types/collections';
import QuestMetadataEditor from './QuestMetadataEditor.vue';
import JSONEditor from '../ui/JSONEditor.vue';
import TextButton from '../ui/TextButton.vue';
import { useQuestsStore } from '../../services/stores/quests';
import QuestsObjectivesEditor from './QuestsObjectivesEditor.vue';

const questConfig = ref<QuestCollectionItem | null>(null);
const loading = ref(false);

const { props } = defineProps<{
    props: {
        questItem: QuestCollectionItem;
    };
    minimized: boolean;
}>();

const tab = ref('metadata');

const triggerSaveConfig = async () => {
    loading.value = true;
    const questsStore = useQuestsStore();
    if (questConfig.value) {
        if (questConfig.value.width === null) {
            delete questConfig.value.width;
        }

        questConfig.value.updatedAt = new Date().toLocaleString();
        await questsStore.saveQuestConfig(questConfig.value, questConfig.value.id);
    }
    loading.value = false;
};

onBeforeMount(() => {
    questConfig.value = props.questItem;
});
</script>
