import { defineStore } from "pinia";
import type { QuestCollectionItem } from "../types/collections";
import { ref } from "vue";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore/lite";
import { useProjectStore } from "./project";
import { firebaseApp } from "../server";
import { useNotifyStore } from "./notify";

export const useQuestsStore = defineStore('quests', () => {
    const quests = ref<QuestCollectionItem[]>([]);

        const loadQuests = async () => {
            const db = getFirestore(firebaseApp);
            const projectId = useProjectStore().workingProject?.id;
            if (!projectId) return;
            const subCol = collection(db, 'projects', projectId, 'quests');

            const snapshot = await getDocs(subCol);

            quests.value = snapshot.docs.map((doc) => ({ ...(doc.data() as QuestCollectionItem) }));
        };

        const saveQuestConfig = async (quest: QuestCollectionItem, previousId?: string) => {
            const db = getFirestore(firebaseApp);
            const projectId = useProjectStore().workingProject?.id;
            if (!projectId) return;

            try {
                if (previousId && previousId !== quest.id) {
                    const oldRef = doc(db, 'projects', projectId, 'quests', previousId);
                    await deleteDoc(oldRef);

                    const newRef = doc(db, 'projects', projectId, 'quests', quest.id);
                    await setDoc(newRef, quest);

                    const oldIdx = quests.value.findIndex((v) => v.id === previousId);
                    if (oldIdx !== -1) quests.value.splice(oldIdx, 1);
                    quests.value.push({ ...quest });
                } else {
                    const projectRef = doc(db, 'projects', projectId, 'quests', quest.id);
                    await setDoc(projectRef, quest);

                    const idx = quests.value.findIndex((v) => v.id === quest.id);
                    if (idx !== -1) {
                        quests.value[idx] = { ...quest };
                    } else {
                        quests.value.push({ ...quest });
                    }
                }

                useNotifyStore().showNotification({
                    message: 'questSaved',
                    type: 'success',
                    icon: 'mdi-content-save',
                    timeout: 3000,
                });
            } catch (err: any) {
                useNotifyStore().showNotification({
                    message: `Error saving quest: ${err?.message ?? err}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            }
        };

        const deleteQuestConfig = async (questId: string) => {
            const db = getFirestore(firebaseApp);
            const projectId = useProjectStore().workingProject?.id;
            if (!projectId) return;

            try {
                const questRef = doc(db, 'projects', projectId, 'quests', questId);
                await deleteDoc(questRef);

                const idx = quests.value.findIndex((v) => v.id === questId);
                if (idx !== -1) {
                    quests.value.splice(idx, 1);
                }

                useNotifyStore().showNotification({
                    message: 'questDeleted',
                    type: 'success',
                    icon: 'mdi-delete',
                    timeout: 3000,
                });
            } catch (err: any) {
                useNotifyStore().showNotification({
                    message: `Error deleting quest: ${err?.message ?? err}`,
                    type: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000,
                });
            }
        };

        return {
            quests,
            loadQuests,
            saveQuestConfig,
            deleteQuestConfig,
        };
})