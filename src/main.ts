import '@mdi/font/css/materialdesignicons.css';
import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles/main.css';
import App from './App.vue';
import './style.css';
import i18n from './services/i18n';
import { initializeFirebase } from './services/server';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { firebaseAuth } from './services/server';
import { useUserStore } from './services/stores/user';

// Definicja motywu "Gothic"
const gothicTheme = {
    dark: true,
    colors: {
        background: '#0b0c10', // Bardzo ciemny, "jaskiniowy" grafit
        surface: '#181b21', // Kolor zimnego kamienia/ciemnej stali
        primary: '#42a5f5', // "Magiczna Ruda" / Kolor Bariery (jasny błękit)
        secondary: '#8d2d2d', // "Stary Obóz" / Rdza / Zakrzepła krew
        accent: '#d4af37', // Złoto / Światło pochodni
        error: '#cf6679', // Standardowy błąd (zgaszona czerwień)
        info: '#2196f3',
        success: '#4caf50', // Kolor ziół leczniczych
        warning: '#fb8c00', // Ogień
        'on-background': '#dcdcdc', // Kolor starego pergaminu (nie idealnie biały tekst)
        'on-surface': '#dcdcdc',
    },
};

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'gothicTheme',
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
        const title = document.title;
        const titleWithRole = title + ' (' + finalUser.role + ')';
        document.title = titleWithRole;
    } catch (err) {
        userStore.setLoggedUser(null);
    }
});

createApp(App).use(vuetify).use(pinia).use(i18n).mount('#app');
