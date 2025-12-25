<template>
    <div>
        <v-text-field
            v-model="search"
            :label="t('searchItems')"
            variant="outlined"
            density="compact"
        ></v-text-field>
        <v-data-table
            v-model="selectedItems"
            :items="items"
            :headers="headers"
            item-key="id"
            class="elevation-0"
            color="accent"
            density="compact"
            show-select
            :search="search"
            select-strategy="all"
            :items-per-page-options="[5, 10, 15, 20, 25]"
            :items-per-page="5"
        ></v-data-table>
        <v-row dense no-gutters justify="end">
            <TextButton
                :prepend-icon="'mdi-check'"
                :text="$t('confirmSelection')"
                :color="'success'"
                :disabled="selectedItems.length === 0"
                variant="outlined"
                rounded="0"
                @click="selectedCallback ? selectedCallback(selectedItems) : null"
            ></TextButton>
        </v-row>
    </div>
</template>

<script lang="ts" setup generic="T extends { id: string, name: string }">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import TextButton from '../ui/TextButton.vue';

const { t } = useI18n();

const search = ref<string>('');

const { alreadySelectedItems } = defineProps<{
    items: T[];
    title: string;
    selectedCallback?: (selectedItems: string[]) => void;
    alreadySelectedItems?: string[];
}>();

const selectedItems = ref<string[]>(alreadySelectedItems || []);

const headers: DataTableHeader[] = [
    {
        title: t('name'),
        key: 'name',
        align: 'start',
    },
];
</script>
