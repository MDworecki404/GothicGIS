<template>
    <v-menu>
        <template #activator="{ props }">
            <icon-button v-bind="props" icon="mdi-dots-vertical" variant="text" />
        </template>
        <v-list class="ma-0 pa-0" activatable>
            <v-list-item
                v-for="item in contextMenuItems"
                :key="item.title"
                :title="item.title"
                :prepend-icon="item.icon"
                v-show="!item.disabled"
                density="compact"
                @click="item.action(propItem)"
            >
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup generic="T">
import type { ContextMenuItems } from '../../services/types/ui';
import IconButton from './IconButton.vue';

defineProps<{
    contextMenuItems: ContextMenuItems;
    propItem: T;
}>();
</script>
