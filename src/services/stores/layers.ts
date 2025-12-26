import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
} from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { LayerCollectionItem } from '../types/collections';
import { useNotifyStore } from './notify';
import { useProjectStore } from './project';

export const useLayersStore = defineStore('layers', () => {
    const layers = ref<LayerCollectionItem[]>([]);
    const layersMap = ref(new Map<string, LayerCollectionItem>());
    const invalidateLayers = ref(new Map<string, LayerCollectionItem>());

    const loadLayers = async () => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;
        const subCol = collection(db, 'projects', projectId, 'layers');

        const snapshot = await getDocs(subCol);

        layers.value = snapshot.docs.map((doc) => ({ ...(doc.data() as LayerCollectionItem) }));
        layersMap.value.clear();
        layers.value.forEach((layer) => {
            layersMap.value.set(layer.id, layer);
        });
    };

    const saveLayerConfig = async (layer: LayerCollectionItem, previousId?: string) => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;

        try {
            if (previousId && previousId !== layer.id) {
                const oldRef = doc(db, 'projects', projectId, 'layers', previousId);
                await deleteDoc(oldRef);

                const newRef = doc(db, 'projects', projectId, 'layers', layer.id);
                await setDoc(newRef, layer);

                const oldIdx = layers.value.findIndex((l) => l.id === previousId);
                if (oldIdx !== -1) layers.value.splice(oldIdx, 1);
                layers.value.push({ ...layer });
            } else {
                const projectRef = doc(db, 'projects', projectId, 'layers', layer.id);
                await setDoc(projectRef, layer);

                const idx = layers.value.findIndex((l) => l.id === layer.id);
                if (idx !== -1) {
                    layers.value[idx] = { ...layer };
                } else {
                    layers.value.push({ ...layer });
                }
            }

            useNotifyStore().showNotification({
                message: 'layerSaved',
                type: 'success',
                icon: 'mdi-content-save',
                timeout: 3000,
            });
        } catch (err: any) {
            useNotifyStore().showNotification({
                message: `Error saving layer: ${err?.message ?? err}`,
                type: 'error',
                icon: 'mdi-alert-circle',
                timeout: 5000,
            });
        }
    };

    const updateLayer = async (layer: LayerCollectionItem) => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;
        const layerRef = doc(db, 'projects', projectId, 'layers', layer.id);
        await updateDoc(layerRef, layer)
            .then(async () => {
                await loadLayers();
                useNotifyStore().showNotification({
                    message: 'layerSaved',
                    type: 'success',
                    icon: 'mdi-content-save',
                    timeout: 3000,
                });
            })
            .catch((err: any) => {
                useNotifyStore().showNotification({
                    message: `Error saving layer: ${err?.message ?? err}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            });
    };

    const deleteLayer = async (layerId: string) => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;
        try {
            const layerRef = doc(db, 'projects', projectId, 'layers', layerId);
            await deleteDoc(layerRef);
            const idx = layers.value.findIndex((l) => l.id === layerId);
            if (idx !== -1) {
                layers.value.splice(idx, 1);
            }
            useNotifyStore().showNotification({
                message: 'layerDeleted',
                type: 'info',
                icon: 'mdi-delete',
                timeout: 5000,
            });
        } catch (err: any) {
            useNotifyStore().showNotification({
                message: `Error deleting layer: ${err?.message ?? err}`,
                type: 'error',
                icon: 'mdi-alert-circle',
                timeout: 5000,
            });
        }
    };

    return { layers, layersMap, loadLayers, saveLayerConfig, updateLayer, deleteLayer, invalidateLayers };
});
