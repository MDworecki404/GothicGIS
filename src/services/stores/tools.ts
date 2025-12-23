import { defineStore } from 'pinia';
import { markRaw, ref, type Component } from 'vue';
import { useDisplay } from 'vuetify';

export type ToolConfig = {
    id: string;
    name: string;
    icon: string;
    component: Component;
    props?: Record<string, any>;
};

export const useToolsStore = defineStore('tools', () => {
    const { mobile } = useDisplay();
    const activeTools = ref<Map<string, ToolConfig>>(new Map());

    const registerTool = ({ id, name, icon, component, props }: ToolConfig) => {
        if (mobile.value && !activeTools.value.has(id) && activeTools.value.size > 0) {
            activeTools.value.clear();
            activeTools.value.set(id, { id, name, icon, component: markRaw(component), props });
            return;
        }
        if (!activeTools.value.has(id)) {
            activeTools.value.set(id, { id, name, icon, component: markRaw(component), props });
        } else {
            unregisterTool(id);
        }
    };

    const unregisterTool = (id: string) => {
        if (activeTools.value.has(id)) {
            activeTools.value.delete(id);
        }
    };

    return {
        activeTools,
        registerTool,
        unregisterTool,
    };
});
