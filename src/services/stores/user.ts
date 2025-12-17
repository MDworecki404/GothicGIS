import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firebaseApp } from '../server';
import type { UserCollection } from '../types/collections';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export const useUserStore = defineStore('user', () => {
    const loggedUser = ref<UserCollection | null>(null);
    const users = ref<UserCollection[]>([]);

    const loadUsers = async () => {
        const db = getFirestore(firebaseApp);
        const colRef = collection(db, 'users');

        const snapshot = await getDocs(colRef);

        users.value = snapshot.docs.map((doc) => ({ ...(doc.data() as UserCollection) }));
    };

    const getUserByEmail = (email: string): UserCollection | undefined => {
        return users.value.find((user) => user.email === email);
    }

    const setLoggedUser = (user: UserCollection | null) => {
        loggedUser.value = user;
    }

    const logOutUser = () => {
        loggedUser.value = null;
    }

    const hasRole = (role: string): boolean => {
        return loggedUser.value?.role === role;
    }

    return {
        loggedUser,
        users,
        loadUsers,
        getUserByEmail,
        setLoggedUser,
        logOutUser,
        hasRole,
    };
});
