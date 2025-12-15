import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { Project } from '../types/collections';

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([]);
    const workingProject = ref<Project | null>(null);

    const loadProjects = async () => {
        const db = getFirestore(firebaseApp);
        const colRef = collection(db, 'projects');

        const snapshot = await getDocs(colRef);

        projects.value = snapshot.docs.map((doc) => ({ ...(doc.data() as Project) }));
    };

    const setWorkingProject = (project: Project) => {
        workingProject.value = project;
    };
    return { projects, loadProjects, workingProject, setWorkingProject };
});
