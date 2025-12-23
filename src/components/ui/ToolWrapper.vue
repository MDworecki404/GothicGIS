<template>
    <v-card
        variant="elevated"
        rounded="0"
        class="pa-0 ma-0"
        min-width="300"
        :width="props.props?.width || 300"
        elevation="12"
    >
        <v-card-title class="pa-0 ma-0">
            <v-toolbar height="50" rounded="0" class="toolbar bg-surface" density="compact">
                <v-toolbar-title class="text-accent text-button">{{ $t(title) }}</v-toolbar-title>
                <template #prepend>
                    <v-icon v-if="icon" color="accent" size="20">{{ icon }}</v-icon>
                </template>
                <template #append>
                    <v-icon
                        color="accent"
                        size="24"
                        style="cursor: pointer"
                        @click="minimized = !minimized"
                        >{{ minimized ? 'mdi-window-maximize' : 'mdi-window-minimize' }}</v-icon
                    >
                    <v-icon color="accent" size="24" style="cursor: pointer" @click="closeTool(id)"
                        >mdi-close</v-icon
                    >
                </template>
            </v-toolbar>
            <v-divider></v-divider>
        </v-card-title>
        <component v-if="!minimized" :is="component" v-bind="props"></component>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, type Component } from 'vue';
import { useToolsStore } from '../../services/stores/tools';

const toolsStore = useToolsStore();
const minimized = ref(false);

const props = defineProps<{
    component: Component;
    title: string;
    icon: string;
    id: string;
    props?: {
        [key: string]: any;
    };
}>();

const closeTool = (id: string) => {
    toolsStore.unregisterTool(id);
};
</script>

<style scoped></style>
