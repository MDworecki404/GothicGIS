import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles/main.css'
import App from './App.vue'
import './style.css'
import i18n from './services/i18n'
import { initializeFirebase } from './services/server'

// Definicja motywu "Gothic"
const gothicTheme = {
  dark: true,
  colors: {
    background: '#0b0c10', // Bardzo ciemny, "jaskiniowy" grafit
    surface: '#181b21',    // Kolor zimnego kamienia/ciemnej stali
    primary: '#42a5f5',    // "Magiczna Ruda" / Kolor Bariery (jasny błękit)
    secondary: '#8d2d2d',  // "Stary Obóz" / Rdza / Zakrzepła krew
    accent: '#d4af37',     // Złoto / Światło pochodni
    error: '#cf6679',      // Standardowy błąd (zgaszona czerwień)
    info: '#2196f3',
    success: '#4caf50',    // Kolor ziół leczniczych
    warning: '#fb8c00',    // Ogień
    'on-background': '#dcdcdc', // Kolor starego pergaminu (nie idealnie biały tekst)
    'on-surface': '#dcdcdc',
  },
}

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

initializeFirebase();

createApp(App).use(vuetify).use(pinia).use(i18n).mount("#app");
