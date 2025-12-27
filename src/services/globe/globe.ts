import { Cartesian3, Ion, JulianDate, Viewer } from 'cesium';
import { getDefaultViewerOptions } from '../defaults';
import { useCommonStore } from '../stores/common';
import { useProjectStore } from '../stores/project';
import { CameraControl } from './cameraControl';
import { DrawService } from './draw';
import { GlobeEvents } from './globeEvents';
import { LayersManager } from './layers';

export let globeInstance: GlobeViewer | null = null;

export class GlobeViewer {
    public viewer: Viewer | null = null;
    private layersManager: LayersManager | null = null;
    private cameraControl: CameraControl | null = null;
    private drawService: DrawService | null = null;
    private eventsService: GlobeEvents | null = null;

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

    get camera(): CameraControl {
        return this.cameraControl!;
    }

    get draw(): DrawService {
        return this.drawService!;
    }

    get events(): GlobeEvents {
        return this.eventsService!;
    }

    initServices() {
        this.eventsService = new GlobeEvents(this.viewer!);
        this.layersManager = new LayersManager(this.viewer!);
        this.cameraControl = new CameraControl(this.viewer!);
        this.drawService = new DrawService(this.viewer!, this.eventsService!);
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
