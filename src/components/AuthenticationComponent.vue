<template>
    <v-card elevation="0" v-if="!userStore.loggedUser">
        <v-card-title>{{ $t('logIn') }}</v-card-title>
        <v-card-text>
            <v-text-field
                v-model="email"
                :label="$t('eMail')"
                variant="underlined"
                :loading="loading"
                :error-messages="error ? $t('invalidCredentials') : ''"
            ></v-text-field>
            <v-text-field
                v-model="password"
                :label="$t('password')"
                variant="underlined"
                type="password"
                :loading="loading"
                :error-messages="error ? $t('invalidCredentials') : ''"
            ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
            <TextButton
                color="success"
                prepend-icon="mdi-login"
                :text="$t('logIn')"
                @click="authenticateUser"
                :loading="loading"
            ></TextButton>
        </v-card-actions>
    </v-card>
    <v-card elevation="0" v-if="userStore.loggedUser">
        <v-card-title>{{ $t('loggedIn') }}</v-card-title>
        <v-card-text>
            <v-row dense no-gutters>
                <span>{{ $t('loggedAs') }}: {{ userStore.loggedUser.email }}</span>
            </v-row>
            <v-row dense no-gutters>
                <span>{{ $t('role') }}: {{ userStore.loggedUser.role }}</span></v-row
            >
        </v-card-text>
        <v-card-actions class="justify-end">
            <TextButton
                color="success"
                prepend-icon="mdi-logout"
                :text="$t('logOut')"
                @click="logOutUser"
                :loading="loading"
            ></TextButton>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { signInWithEmailAndPassword, getIdTokenResult, signOut } from 'firebase/auth';
import { ref } from 'vue';
import { firebaseAuth } from '../services/server';
import { useUserStore } from '../services/stores/user';
import type { UserCollection } from '../services/types/collections';
import TextButton from './ui/TextButton.vue';

const userStore = useUserStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const authenticateUser = async () => {
    loading.value = true;
    error.value = '';
    try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
        const idRes = await getIdTokenResult(firebaseAuth.currentUser!);
        const roleFromClaim = idRes.claims.role as string | undefined;

        const userFromDb: UserCollection | undefined = userStore.getUserByEmail(cred.user.email!);
        if (userFromDb) {
            const updated: UserCollection = {
                ...userFromDb,
                role: (roleFromClaim as UserCollection['role']) ?? userFromDb.role,
            };
            userStore.setLoggedUser(updated);
            const title = document.title
            const titleWithRole = title + ' (' + updated.role + ')';
            document.title = titleWithRole;
        } else {
            const fallback: UserCollection = {
                email: cred.user.email!,
                role: (roleFromClaim as UserCollection['role']) ?? 'viewer',
            };
            userStore.setLoggedUser(fallback);
        }
    } catch (e: any) {
        error.value = e.message || 'Błąd logowania';
    } finally {
        loading.value = false;
    }
};

const logOutUser = async () => {
    loading.value = true;
    error.value = '';
    try {
        await signOut(firebaseAuth);
        userStore.logOutUser();
    } catch (e: any) {
        error.value = e.message || 'Błąd wylogowywania';
    } finally {
        loading.value = false;
    }
};
</script>
