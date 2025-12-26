import '@mdi/font/css/materialdesignicons.css';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles/main.css';
import App from './App.vue';
import i18n from './services/i18n';
import { firebaseAuth, initializeFirebase } from './services/server';
import { useUserStore } from './services/stores/user';
import './style.css';

const gothicTheme = {
    dark: true,
    colors: {
        background: '#0b0c10',
        surface: '#181b21',
        primary: '#42a5f5',
        secondary: '#8d2d2d',
        accent: '#d4af37',
        error: '#cf6679',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#fb8c00',
        'on-background': '#dcdcdc',
        'on-surface': '#dcdcdc',
    },
};

export const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: localStorage.getItem('selectedTheme') || 'gothicTheme',
        themes: {
            gothicTheme,
        },
    },
});

const pinia = createPinia();
setActivePinia(pinia);

initializeFirebase();

onAuthStateChanged(firebaseAuth, async (user) => {
    const userStore = useUserStore();
    if (!user) {
        userStore.setLoggedUser(null);
        return;
    }

    try {
        await userStore.loadUsers();

        const idRes = await getIdTokenResult(user);
        const roleFromClaim = idRes.claims.role as string | undefined;

        const dbUser = userStore.getUserByEmail(user.email ?? '');
        const finalUser = dbUser
            ? { ...dbUser, role: (roleFromClaim as typeof dbUser.role) ?? dbUser.role }
            : { email: user.email ?? '', role: (roleFromClaim as any) ?? 'viewer' };

        userStore.setLoggedUser(finalUser);
        if (finalUser.role === 'admin') {
            const title = document.title;
            const titleWithRole = title + ' (' + finalUser.role + ')';
            document.title = titleWithRole;
        }
    } catch (err) {
        userStore.setLoggedUser(null);
    }
});

createApp(App).use(vuetify).use(pinia).use(i18n).mount('#app');
