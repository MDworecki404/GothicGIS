import { Cartesian3 } from '@cesium/engine';
import { Ion, Viewer } from 'cesium';
import { getDefaultViewerOptions } from '../defaults';
import { useCommonStore } from '../stores/common';
import { useProjectStore } from '../stores/project';
import { LayersManager } from './layers';
import { JulianDate } from '@cesium/engine';

export let globeInstance: GlobeViewer | null = null;

export class GlobeViewer {
    public viewer: Viewer | null = null;
    private layersManager: LayersManager | null = null;

    constructor(target: HTMLElement) {
        this.viewer = new Viewer(target, getDefaultViewerOptions());
        this.viewer.clock.shouldAnimate = false;
        this.viewer.clock.multiplier = 0;
        const year = new Date().getFullYear();
        this.viewer.clock.currentTime = JulianDate.fromDate(new Date(year, 2, 20, 12, 0, 0));

        this.initServices();
    }

    get layers(): LayersManager {
        return this.layersManager!;
    }

    initServices() {
        this.layersManager = new LayersManager(this.viewer!);
    }

    destroy() {
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = null;
        }
        if (this.layersManager) {
            this.layersManager.destroy();
            this.layersManager = null;
        }
    }
}

export const initGlobeInstance = async (target: HTMLElement, force = false) => {
    await import('@cesium/engine/Source/Widget/CesiumWidget.css');
    const { workingProject } = useProjectStore();

    const token = import.meta.env.VITE_CESIUM_API_KEY;
    Ion.defaultAccessToken = token;

    if (globeInstance && force) {
        globeInstance.destroy();
        globeInstance = null;
    }

    if (!globeInstance) {
        globeInstance = new GlobeViewer(target);
    }
    if (globeInstance) {
        try {
            await globeInstance.layers.ready;

            globeInstance.viewer!.camera.setView({
                destination: Cartesian3.fromArray([
                    workingProject?.initView?.x ?? 0,
                    workingProject?.initView?.y ?? 0,
                    workingProject?.initView?.z ?? 0,
                ]),
                orientation: {
                    heading: workingProject?.initView?.heading,
                    pitch: workingProject?.initView?.pitch,
                    roll: 0,
                },
            });
        } catch (e) {
            console.warn('Error while loading layers:', e);
        }
    }

    useCommonStore().setAppLoaded(true);
};
