<template>
    <v-tabs v-model="tab" align-tabs="center">
        <v-tab value="graphicEditor">{{ $t('graphicEditor') }}</v-tab>
        <v-tab value="jsonEditor">{{ $t('jsonEditor') }}</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
        <v-tabs-window-item value="graphicEditor">
            <v-row dense no-gutters>
                <v-text-field
                    v-model="projectConfig!.name"
                    :label="$t('projectName')"
                    class="ma-4"
                    variant="outlined"
                ></v-text-field>
                <v-text-field
                    v-model="projectConfig!.icon"
                    :label="$t('icon')"
                    class="ma-4"
                    variant="outlined"
                    :append-inner-icon="projectConfig!.icon"
                ></v-text-field>
            </v-row>
            <v-row dense no-gutters justify="end">
                <TextButton
                    color="success"
                    :loading="loading"
                    prepend-icon="mdi-content-save"
                    :text="$t('save')"
                    @click="saveConfig(projectConfig!)"
                ></TextButton>
            </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="jsonEditor">
            <JSONEditor
                :code="JSON.stringify(projectConfig, null, 4)"
                :width="550"
                :height="400"
                :loading="loading"
                @save="saveConfig(JSON.parse($event))"
                @update:code="projectConfig = JSON.parse($event)"
            ></JSONEditor>
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useProjectStore } from '../../services/stores/project';
import { type Project } from '../../services/types/collections';
import JSONEditor from '../ui/JSONEditor.vue';
import TextButton from '../ui/TextButton.vue';

const tab = ref('graphicEditor');
const loading = ref(false);

const projectConfig = ref<Project>();

const saveConfig = async (config: Project) => {
    loading.value = true;
    const projectId = config.id
    const projectStore = useProjectStore();
    await projectStore.saveProjectConfig(projectId, config).finally(() => {
        projectStore.loadProjects();
        projectConfig.value = config;
        loading.value = false;
    });

}

onBeforeMount(() => {
    const projectStore = useProjectStore();
    projectConfig.value = projectStore.workingProject!;
});
</script>
