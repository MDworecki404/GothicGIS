<template>
    <div class="d-flex justify-center align-center h-100">
        <v-hover>
            <template #default="{ isHovering, props }">
                <v-icon
                    v-bind="props"
                    class="logIn"
                    :color="isHovering ? 'accent' : 'transparent'"
                    @click="openLogInDialog"
                >
                    mdi-shield-crown
                </v-icon>
            </template>
        </v-hover>
        <v-card class="pa-4 bg-background" elevation="0">
            <v-card-title>{{ $t('welcome') }}</v-card-title>
            <v-card-subtitle>
                {{ $t('selectZen') }}
            </v-card-subtitle>
            <v-card-text>
                <v-list class="bg-background">
                    <v-list-item v-for="project in availableProjects" :key="project.id">
                        <template #prepend>
                            <v-icon color="primary">{{ project.icon }}</v-icon>
                        </template>
                        <template #title>
                            {{ $t(project.name) }}
                        </template>
                        <template #append>
                            <icon-button
                                custom-class="ml-5 background"
                                elevation="0"
                                icon="mdi-open-in-app"
                                v-tooltip="{
                                    text: $t('selectZen'),
                                }"
                                variant="text"
                                @click="useProjectStore().setWorkingProject(project)"
                            ></icon-button>
                            <icon-button
                                v-if="useUserStore().hasRole('admin')"
                                custom-class="ml-5 background"
                                elevation="0"
                                icon="mdi-delete-alert-outline"
                                icon-color="error"
                                v-tooltip="{
                                    text: $t('deleteProject'),
                                }"
                                variant="text"
                                @click="deleteProject(project.id)"
                            ></icon-button>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions v-if="useUserStore().hasRole('admin')" class="d-flex justify-end">
                <text-button
                    variant="outlined"
                    color="secondary"
                    prepend-icon="mdi-folder-plus"
                    :text="$t('addNewProject')"
                    rounded="0"
                    @click="openNewProjectDialog"
                />
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useDialogStore } from '../services/stores/dialog';
import { useProjectStore } from '../services/stores/project';
import { useUserStore } from '../services/stores/user';
import type { Project } from '../services/types/collections';
import IconButton from './ui/IconButton.vue';
import TextButton from './ui/TextButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const availableProjects = ref<Project[]>([]);

watch(() => useProjectStore().projects, (newProjects) => {
    availableProjects.value = newProjects;
});

onMounted(async () => {
    availableProjects.value = useProjectStore().projects;
});

const openLogInDialog = async () => {
    const AuthenticationComponent = await import('./AuthenticationComponent.vue');
    const dialogStore = useDialogStore();
    dialogStore.showDialog({
        component: AuthenticationComponent.default,
        dialogStyle: {
            width: 400,
        },
    });
};

const openNewProjectDialog = async () => {
    const CreateNewProjectComponent = await import('./Editors/CreateNewProject.vue');
    const dialogStore = useDialogStore();
    dialogStore.showDialog({
        component: CreateNewProjectComponent.default,
        dialogStyle: {
            width: 600,
        },
    });
};

const deleteProject = async (projectId: string) => {
    const AreYouSureComponent = await import('./Editors/AreYouSure.vue');
    const dialogStore = useDialogStore();
    dialogStore.showDialog({
        component: AreYouSureComponent.default,
        dialogStyle: {
            width: 400,
        },
        disableDefaultCloseButton: true,
        props: {
            text: t('areYouSureDeleteProject'),
            onConfirm: async () => {
                await useProjectStore().deleteProject(projectId);
                dialogStore.closeDialog();
            },
            onCancel: () => {
                dialogStore.closeDialog();
            },
        },
    });
};
</script>

<style scoped>
.logIn {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
}
</style>
