import { Ion, Viewer } from 'cesium';
import { getDefaultViewerOptions } from '../defaults';
import { useCommonStore } from '../stores/common';
import { LayersManager } from './layers';

export let globeInstance: GlobeViewer | null = null;

export class GlobeViewer {
    public viewer: Viewer | null = null;
    private layersManager: LayersManager | null = null;

    constructor(target: HTMLElement) {
        this.viewer = new Viewer(target, getDefaultViewerOptions());

        this.initServices();
    }

    get layers(): LayersManager {
        return this.layersManager!;
    }

    initServices() {
        this.layersManager = new LayersManager(this.viewer!);
    }
}

export const initGlobeInstance = async (target: HTMLElement) => {
    await import('@cesium/engine/Source/Widget/CesiumWidget.css');

    const token = import.meta.env.VITE_CESIUM_API_KEY;
    Ion.defaultAccessToken = token;

    if (!globeInstance) {
        globeInstance = new GlobeViewer(target);
    }

    setTimeout(() => {
        useCommonStore().setAppLoaded(true);
    }, 2000);
};
