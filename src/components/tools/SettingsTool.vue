<template>
    <v-card-text class="pt-5">
        <v-row dense no-gutters class="d-flex ga-5">
            <v-select
                v-model="selectedTheme"
                :items="availableThemes"
                :item-title="(item) => $t(item)"
                :item-value="(item) => item"
                :label="$t('theme')"
                variant="underlined"
                prepend-inner-icon="mdi-palette-outline"
                color="accent"
                @update:model-value="onThemeChange"
            ></v-select>
            <v-select
                v-model="selectedLanguage"
                :items="availableLanguages"
                :item-title="(item) => $t(item)"
                :item-value="(item) => item"
                :label="$t('language')"
                variant="underlined"
                prepend-inner-icon="mdi-translate"
                color="accent"
                @update:model-value="onLanguageChange"
            ></v-select>
        </v-row>
    </v-card-text>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { vuetify } from '../../main';
import i18n from '../../services/i18n';

const selectedTheme = ref('pl');
const selectedLanguage = ref<'pl' | 'en'>('pl');
const availableThemes = ref<string[]>([]);
const availableLanguages = ref<('pl' | 'en')[]>(['pl', 'en']);

const onThemeChange = (newTheme: string) => {
    vuetify.theme.change(newTheme);
    localStorage.setItem('selectedTheme', newTheme);
};

const onLanguageChange = (newLanguage: 'pl' | 'en') => {
    i18n.global.locale.value = newLanguage;
    localStorage.setItem('selectedLanguage', newLanguage);
};

onMounted(() => {
    availableThemes.value = Object.keys(vuetify.theme.themes.value);
    availableLanguages;
    selectedTheme.value = vuetify.theme.name.value;
    selectedLanguage.value = i18n.global.locale.value;
});
</script>
