import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { Project } from '../types/project';

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([]);

    const loadProjects = async () => {
        const db = getFirestore(firebaseApp);
        const colRef = collection(db, 'projects');

        const snapshot = await getDocs(colRef);

        projects.value = snapshot.docs.map((doc) => ({ ...(doc.data() as Project) }));
    };
    return { projects, loadProjects };
});
