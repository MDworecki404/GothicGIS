<template>
    <div v-if="questCopy">
        <v-row dense no-gutters>
            <v-text-field
                v-model="questCopy.name"
                :label="$t('questName')"
                variant="outlined"
                density="compact"
                class="pa-3"
                @update:model-value="emit('update:questItem', questCopy)"
            ></v-text-field>
        </v-row>
        <v-row dense no-gutters>
            <v-select
                v-model="questCopy.category"
                :items="questsCategories"
                :item-title="(item) => $t(item)"
                :item-value="(item) => item"
                :max-width="300"
                variant="outlined"
                density="compact"
                :label="$t('questCategory')"
                class="pa-3"
                @update:model-value="
                    emit('update:questItem', { ...questCopy, category: questCopy.category })
                "
            ></v-select>
            <v-number-input
                v-model="questCopy.width"
                variant="outlined"
                :max-width="200"
                :label="$t('questWindowWidth')"
                density="compact"
                :center-affix="true"
                :clearable="true"
                :min="0"
                :control-variant="'hidden'"
                class="pa-3"
                @update:model-value="emit('update:questItem', questCopy)"
            >
            </v-number-input>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { onMounted, ref, watch } from 'vue';
import {
    type QuestCollectionCategory,
    type QuestCollectionItem,
} from '../../services/types/collections';

const emit = defineEmits<{
    (e: 'update:questItem', value: QuestCollectionItem): void;
}>();

const questCopy = ref<QuestCollectionItem>();

const questsCategories = ref<QuestCollectionCategory[]>(['mainQuests', 'sideQuests']);

const { questItem } = defineProps<{
    questItem: QuestCollectionItem;
}>();

watch(
    () => questCopy.value,
    (newVal) => {
        if (newVal) {
            emit('update:questItem', newVal);
        }
    }
);

onMounted(() => {
    questCopy.value = cloneDeep(questItem);
});
</script>
