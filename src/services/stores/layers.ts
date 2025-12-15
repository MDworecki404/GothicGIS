import { defineStore } from "pinia";
import { ref } from "vue";
import type { LayerCollectionItem } from "../types/collections";
import { firebaseApp } from "../server";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";
import { useProjectStore } from "./project";

export const useLayersStore = defineStore("layers", () => {
    const layers = ref<LayerCollectionItem[]>([]);

    const loadLayers = async () => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;
        const subCol = collection(db, 'projects', projectId, 'layers');

        const snapshot = await getDocs(subCol);

        layers.value = snapshot.docs.map((doc) => ({ ...(doc.data() as LayerCollectionItem) }));
    }

    return { layers, loadLayers };
})