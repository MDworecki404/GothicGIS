import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
    const isAppLoaded = ref(false);

    const setAppLoaded = (loaded: boolean) => {
        isAppLoaded.value = loaded;
    };

    return { isAppLoaded, setAppLoaded };
})