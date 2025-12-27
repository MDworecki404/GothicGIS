<template>
    <div>
        <v-row dense no-gutters class="ga-5">
            <v-text-field
                v-model="projectConfig.name"
                variant="outlined"
                :loading="loading"
                :label="$t('name')"
            ></v-text-field>
            <v-text-field
                v-model="projectConfig.icon"
                variant="outlined"
                :label="$t('icon')"
                :loading="loading"
                :append-inner-icon="projectConfig.icon"
            ></v-text-field>
        </v-row>
        <v-row dense no-gutters class="ga-5">
            <v-textarea
                v-model="projectConfig.description"
                variant="outlined"
                :loading="loading"
                :label="$t('description')"
            ></v-textarea>
        </v-row>
        <v-row dense no-gutters justify="end">
            <TextButton
                :text="$t('createProject')"
                prepend-icon="mdi-check"
                color="success"
                rounded="0"
                :loading="loading"
                :disabled="!projectConfig.name || !projectConfig.icon"
                @click="triggerCreateProject"
            ></TextButton>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getDefaultProjectConfig } from '../../services/defaults';
import { useDialogStore } from '../../services/stores/dialog';
import { useProjectStore } from '../../services/stores/project';
import { type Project } from '../../services/types/collections';
import TextButton from '../ui/TextButton.vue';

const projectConfig = ref<Project>(getDefaultProjectConfig());

const loading = ref(false);

const triggerCreateProject = async () => {
    loading.value = true;
    projectConfig.value.createdAt = new Date().toLocaleString();
    projectConfig.value.updatedAt = new Date().toLocaleString();
    const projectStore = useProjectStore();
    await projectStore.createNewProject(projectConfig.value);
    useDialogStore().closeDialog();
    loading.value = false;
};
</script>
