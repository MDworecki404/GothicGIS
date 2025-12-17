import type { Viewer } from "cesium";

export const getDefaultViewerOptions = (): Viewer.ConstructorOptions => {
    return {
        terrainProvider: undefined,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        baseLayer: false,
        globe: false
    };
};
