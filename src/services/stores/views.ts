import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { ViewConfigItem } from '../types/collections';
import { useNotifyStore } from './notify';
import { useProjectStore } from './project';

export const useViewsStore = defineStore('views', () => {
    const views = ref<ViewConfigItem[]>([]);

    const loadViews = async () => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;
        const subCol = collection(db, 'projects', projectId, 'views');

        const snapshot = await getDocs(subCol);

        views.value = snapshot.docs.map((doc) => ({ ...(doc.data() as ViewConfigItem) }));
    };

    const saveViewConfig = async (view: ViewConfigItem, previousId?: string) => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;

        try {
            if (previousId && previousId !== view.id) {
                const oldRef = doc(db, 'projects', projectId, 'views', previousId);
                await deleteDoc(oldRef);

                const newRef = doc(db, 'projects', projectId, 'views', view.id);
                await setDoc(newRef, view);

                const oldIdx = views.value.findIndex((v) => v.id === previousId);
                if (oldIdx !== -1) views.value.splice(oldIdx, 1);
                views.value.push({ ...view });
            } else {
                const projectRef = doc(db, 'projects', projectId, 'views', view.id);
                await setDoc(projectRef, view);

                const idx = views.value.findIndex((v) => v.id === view.id);
                if (idx !== -1) {
                    views.value[idx] = { ...view };
                } else {
                    views.value.push({ ...view });
                }
            }

            useNotifyStore().showNotification({
                message: 'viewSaved',
                type: 'success',
                icon: 'mdi-content-save',
                timeout: 3000,
            });
        } catch (err: any) {
            useNotifyStore().showNotification({
                message: `Error saving view: ${err?.message ?? err}`,
                type: 'error',
                icon: 'mdi-alert-circle',
                timeout: 5000,
            });
        }
    };

    const deleteViewConfig = async (viewId: string) => {
        const db = getFirestore(firebaseApp);
        const projectId = useProjectStore().workingProject?.id;
        if (!projectId) return;

        try {
            const viewRef = doc(db, 'projects', projectId, 'views', viewId);
            await deleteDoc(viewRef);

            const idx = views.value.findIndex((v) => v.id === viewId);
            if (idx !== -1) {
                views.value.splice(idx, 1);
            }

            useNotifyStore().showNotification({
                message: 'viewDeleted',
                type: 'success',
                icon: 'mdi-delete',
                timeout: 3000,
            });
        } catch (err: any) {
            useNotifyStore().showNotification({
                message: `Error deleting view: ${err?.message ?? err}`,
                type: 'error',
                icon: 'mdi-alert-circle',
                timeout: 5000,
            });
        }
    };

    return {
        views,
        loadViews,
        saveViewConfig,
        deleteViewConfig,
    };
});
