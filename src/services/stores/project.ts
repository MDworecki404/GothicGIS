import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
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
        await setDoc(projectRef, config).catch((err) => {
            useNotifyStore().showNotification({
                message: `Error saving project: ${err.message}`,
                type: 'error',
                icon: 'mdi-alert-circle',
                timeout: 5000,
            });
        }).finally(() => {
            useNotifyStore().showNotification({
                message: 'projectSaved',
                type: 'success',
                icon: 'mdi-content-save',
                timeout: 3000,
            })
        })
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
    };
});
