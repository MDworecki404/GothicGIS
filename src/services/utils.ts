import { Cartesian3, JulianDate, Ray } from 'cesium';
import { globeInstance } from './globe/globe';
import type { ViewConfigItem } from './types/collections';

export const setDefaultTimeOfDay = () => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;
    const year = new Date().getFullYear();
    viewer.clock.currentTime = JulianDate.fromDate(new Date(year, 2, 20, 12, 0, 0));
};

export const getCameraFocus = () => {
    const { scene, camera } = globeInstance!.viewer!;
    const ray = new Ray(camera.positionWC, camera.directionWC);
    const intersection = scene.globe.pick(ray, scene);

    if (intersection) {
        return intersection;
    }
    ray.direction = camera.upWC;
    const cameraIntersection = scene.globe.pick(ray, scene);
    return cameraIntersection || camera.positionWC;
};

export const zoomToLayer = (layerId: string) => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;

    const targetLayer = globeInstance?.layers.layers.find((layer) => layer.appId === layerId);

    if (!targetLayer) return;

    viewer.flyTo(targetLayer, { duration: 1.5 });
};

export const zoomToViewConfig = (viewConfig: ViewConfigItem, duration: number) => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;

    viewer.camera.flyTo({
        destination: new Cartesian3(viewConfig.view.x, viewConfig.view.y, viewConfig.view.z),
        orientation: {
            heading: viewConfig.view.heading,
            pitch: viewConfig.view.pitch,
        },
        duration: duration
    });
};
