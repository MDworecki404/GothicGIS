<template>
    <v-card-text>
        <v-row dense no-gutters>
            <v-checkbox
                v-model="commonStore.controlByKeyboard"
                color="accent"
                :label="$t('controlByKeyboard')"
                hide-details
            ></v-checkbox>
        </v-row>
        <v-slide-y-transition>
            <div v-if="commonStore.controlByKeyboard">
                <v-row dense no-gutters>
                    <span>{{ $t('movement') }}:</span>
                </v-row>
                <v-row dense no-gutters class="mt-2" justify="center" align="center">
                    <span>
                        <v-hotkey keys="w a s d r f" variant="elevated" platform="auto"></v-hotkey
                    ></span>
                    <v-number-input
                        v-model="commonStore.moveAmount"
                        :label="$t('moveAmountFactor')"
                        :min="0"
                        :precision="3"
                        :step="1"
                        variant="outlined"
                        hide-details
                        density="compact"
                        class="ml-4"
                    ></v-number-input>
                </v-row>
                <v-row dense no-gutters class="mt-7">
                    <span>{{ $t('cameraRotating') }}:</span>
                </v-row>
                <v-row dense no-gutters class="mt-2">
                    <span>
                        <v-hotkey
                            keys="left right up down"
                            variant="elevated"
                            platform="auto"
                        ></v-hotkey
                    ></span>
                    <v-number-input
                        v-model="commonStore.rotationAmount"
                        :label="$t('rotationAmountFactor(degrees)')"
                        :min="0"
                        :precision="3"
                        :step="1"
                        variant="outlined"
                        hide-details
                        density="compact"
                        class="ml-4"
                    ></v-number-input>
                </v-row>
            </div>
        </v-slide-y-transition>
    </v-card-text>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { useCommonStore } from '../../services/stores/common';

const commonStore = useCommonStore();

onUnmounted(() => {
    commonStore.setControlByKeyboard(false)
})
</script>
