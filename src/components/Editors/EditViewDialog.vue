<template>
    <JSONEditor
        :code="JSON.stringify(config, null, 2)"
        :disable-save-btn="true"
        @update:code="onCodeUpdate"
    />
    <v-row dense no-gutters justify="end">
        <TextButton
            prepend-icon="mdi-content-save"
            color="success"
            class="ma-2"
            :text="$t('save')"
            @click="saveConfig"
        />
    </v-row>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { onMounted, ref } from 'vue';
import { useViewsStore } from '../../services/stores/views';
import type { ViewConfigItem } from '../../services/types/collections';
import JSONEditor from '../ui/JSONEditor.vue';
import TextButton from '../ui/TextButton.vue';

const config = ref<ViewConfigItem | null>(null);

const props = defineProps<{ viewItem: ViewConfigItem }>();

const saveConfig = () => {
    useViewsStore().saveViewConfig(config.value!, props.viewItem.id);
};

function onCodeUpdate(newCode: string) {
    config.value = JSON.parse(newCode);
}

onMounted(() => {
    config.value = cloneDeep(props.viewItem);
});
</script>
