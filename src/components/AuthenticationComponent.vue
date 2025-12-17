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
import { signInWithEmailAndPassword } from 'firebase/auth';
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
        const user: UserCollection | undefined = userStore.getUserByEmail(cred.user.email!);
        if (!user) throw new Error('User not found in database');
        userStore.setLoggedUser(user);
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
        await firebaseAuth.signOut();
        userStore.logOutUser();
    } catch (e: any) {
        error.value = e.message || 'Błąd wylogowywania';
    } finally {
        loading.value = false;
    }
};
</script>
