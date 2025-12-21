<template>
    <div>
        <CodeEditor
            v-model:value="config"
            :language="'json'"
            :theme="$vuetify.theme.current.dark ? 'vs-dark' : 'vs-light'"
            :options="{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
            }"
            :style="{ width: (width || 600) + 'px', height: (height || 400) + 'px' }"
            @update:value="(val: string) => {
                $emit('update:code', val);
            }"
        ></CodeEditor>
        <v-row dense no-gutters justify="end" v-if="!disableSaveBtn">
            <TextButton
                color="success"
                :loading="loading"
                prepend-icon="mdi-content-save"
                :text="$t('save')"
                @click="$emit('save', config)"
            ></TextButton>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { CodeEditor } from 'monaco-editor-vue3';
import { onBeforeMount, ref, watch } from 'vue';
import TextButton from './TextButton.vue';

const config = ref<string>('');

defineEmits<{
    (e: 'save', config: string): void;
    (e: 'update:code', code: string): void;
}>();

const { code } = defineProps<{
    code: string;
    width?: number;
    height?: number;
    loading?: boolean;
    disableSaveBtn?: boolean;
}>();

watch(() => code, (newCode) => {
    config.value = newCode;
});

onBeforeMount(() => {
    config.value = code;
});
</script>
