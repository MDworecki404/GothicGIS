import { JulianDate } from 'cesium';
import { globeInstance } from './globe/globe';
import { Ray } from 'cesium';

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
