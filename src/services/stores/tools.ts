import { defineStore } from "pinia";
import { ref, type Component, markRaw } from "vue";

export type ToolConfig = {
    id: string;
    name: string;
    icon: string;
    component: Component
    props?: Record<string, any>;
}

export const useToolsStore = defineStore('tools', () => {
    const activeTools = ref<Map<string, ToolConfig>>(new Map());

    const registerTool = ({ id, name, icon, component, props }: ToolConfig) => {
        if (!activeTools.value.has(id)) {
            activeTools.value.set(id, { id, name, icon, component: markRaw(component), props });
        }
    }

    const unregisterTool = (id: string) => {
        if (activeTools.value.has(id)) {
            activeTools.value.delete(id);
        }
    }

    return {
        activeTools,
        registerTool,
        unregisterTool,
    }
})