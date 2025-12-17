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
                            <v-icon>{{ project.icon }}</v-icon>
                        </template>
                        <template #title>
                            {{ $t(project.name) }}
                        </template>
                        <template #append>
                            <v-btn
                                class="ml-5 bg-background"
                                elevation="0"
                                icon="mdi-open-in-app"
                                v-tooltip="{
                                    text: $t('selectZen')
                                }"
                                @click="useProjectStore().setWorkingProject(project)"
                            ></v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useDialogStore } from '../services/stores/dialog';
import { useProjectStore } from '../services/stores/project';
import type { Project } from '../services/types/collections';

const availableProjects = ref<Project[]>([]);

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
        }
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
