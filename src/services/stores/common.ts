import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { globeInstance } from '../globe/globe';

export const useCommonStore = defineStore('common', () => {
    const isAppLoaded = ref(false);

    const setAppLoaded = (loaded: boolean) => {
        isAppLoaded.value = loaded;
    };

    const controlByKeyboard = ref(false);
    const moveAmount = ref(1000);

    const setControlByKeyboard = (enabled: boolean) => {
        controlByKeyboard.value = enabled;
    };

    watch([controlByKeyboard, moveAmount], ([newControlByKeyboard, newMoveAmount]) => {
        const cameraControl = globeInstance?.camera;
        if (!cameraControl) return;

        cameraControl.removeKeyboardControls();

        if (newControlByKeyboard) {
            cameraControl.setupKeyboardControls(Number(newMoveAmount) || 0);
        }
    });

    return { isAppLoaded, setAppLoaded, controlByKeyboard, setControlByKeyboard, moveAmount };
});
