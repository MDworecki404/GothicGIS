import { Cesium3DTileset } from '@cesium/engine';
import { Ion, Viewer } from 'cesium';

export let globeInstance: GlobeViewer | null = null;

export class GlobeViewer {
    public viewer: Viewer | null = null;

    constructor(target: HTMLElement) {
        this.viewer = new Viewer(target, {
            terrainProvider: undefined,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            globe: false,
            fullscreenButton: false,
            vrButton: false,
            baseLayer: false,
            skyAtmosphere: false,
            skyBox: false,
        });
    }
}

export const initGlobeInstance = async (target: HTMLElement) => {
    await import('@cesium/engine/Source/Widget/CesiumWidget.css');

    const token = import.meta.env.VITE_CESIUM_ION_TOKEN || import.meta.env.VITE_CESIUM_API_KEY;
    Ion.defaultAccessToken = token;

    if (!globeInstance) {
        globeInstance = new GlobeViewer(target);
    }

    try {
        const tileset = await Cesium3DTileset.fromIonAssetId(4223514, {
            maximumScreenSpaceError: 20,
        });
        globeInstance.viewer?.scene.primitives.add(tileset);
        globeInstance.viewer?.zoomTo(tileset);
    } catch (e) {
        console.error('Failed to load Cesium 3D tileset:', e);
    }

    try {
        const tileset = await Cesium3DTileset.fromIonAssetId(4223516, {
            maximumScreenSpaceError: 20,
        });
        globeInstance.viewer?.scene.primitives.add(tileset);
        globeInstance.viewer?.zoomTo(tileset);
    } catch (e) {
        console.error('Failed to load Cesium 3D tileset:', e);
    }

    try {
        const tileset = await Cesium3DTileset.fromIonAssetId(4223519, {
            maximumScreenSpaceError: 20,
        });
        globeInstance.viewer?.scene.primitives.add(tileset);
        globeInstance.viewer?.zoomTo(tileset);
    } catch (e) {
        console.error('Failed to load Cesium 3D tileset:', e);
    }
};
