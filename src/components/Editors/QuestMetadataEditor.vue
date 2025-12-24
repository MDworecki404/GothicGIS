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
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { QuestCollectionItem } from '../../services/types/collections';
import { cloneDeep } from 'lodash';

const emit = defineEmits<{
    (e: 'update:questItem', value: QuestCollectionItem): void;
}>();

const questCopy = ref<QuestCollectionItem>();

const {questItem} = defineProps<{
    questItem: QuestCollectionItem;
}>();

onMounted(() => {
    questCopy.value = cloneDeep(questItem);
});
</script>
