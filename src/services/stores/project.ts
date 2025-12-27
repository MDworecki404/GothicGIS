import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { Project } from '../types/collections';
import { useNotifyStore } from './notify';

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([]);
    const workingProject = ref<Project | null>(null);

    const loadProjects = async () => {
        const db = getFirestore(firebaseApp);
        const colRef = collection(db, 'projects');

        const snapshot = await getDocs(colRef);

        projects.value = snapshot.docs.map((doc) => ({ ...(doc.data() as Project) }));
    };

    const saveProjectConfig = async (projectId: string, config: Project) => {
        const db = getFirestore(firebaseApp);
        const projectRef = doc(db, 'projects', projectId);
        await setDoc(projectRef, config)
            .catch((err) => {
                useNotifyStore().showNotification({
                    message: `Error saving project: ${err.message}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            })
            .finally(() => {
                useNotifyStore().showNotification({
                    message: 'projectSaved',
                    type: 'success',
                    icon: 'mdi-content-save',
                    timeout: 3000,
                });
            });
    };

    const createNewProject = async (config: Project) => {
        const db = getFirestore(firebaseApp);
        const projectRef = doc(db, 'projects', config.id);
        await setDoc(projectRef, config)
            .then(() => {
                projects.value.push(config);
                useNotifyStore().showNotification({
                    message: 'projectCreated',
                    type: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 3000,
                });

                setWorkingProject(config);
            })
            .catch((err) => {
                useNotifyStore().showNotification({
                    message: `Error creating project: ${err.message}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            });
    };

    const deleteProject = async (projectId: string) => {
        const db = getFirestore(firebaseApp);
        const projectRef = doc(db, 'projects', projectId);
        await deleteDoc(projectRef)
            .then(async () => {
                useNotifyStore().showNotification({
                    message: 'projectDeleted',
                    type: 'success',
                    icon: 'mdi-delete',
                    timeout: 3000,
                });
                await loadProjects();
            })
            .catch((err) => {
                useNotifyStore().showNotification({
                    message: `Error deleting project: ${err.message}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            });
    };

    const setWorkingProject = (project: Project) => {
        workingProject.value = project;
    };

    const unsetWorkingProject = () => {
        workingProject.value = null;
    };

    return {
        projects,
        loadProjects,
        workingProject,
        setWorkingProject,
        unsetWorkingProject,
        saveProjectConfig,
        createNewProject,
        deleteProject,
    };
});
