import { Cartesian2, Cartesian3, JulianDate, Matrix4, Ray, Transforms } from 'cesium';
import { globeInstance } from './globe/globe';
import type { ViewConfigItem } from './types/collections';
import { Cartographic } from 'cesium';

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
        duration: duration,
    });
};

export const calculateDistanceFromCartesian3Array = (positions: Cartesian3[]): number => {
    let distance = 0;
    for (let i = 1; i < positions.length; i++) {
        distance += Cartesian3.distance(positions[i - 1]!, positions[i]!);
    }
    return distance;
};

export const getCentroidFromCartesian3Array = (positions: Cartesian3[]): Cartesian3 => {
    if (!positions || positions.length === 0) {
        return new Cartesian3();
    }

    let x = 0;
    let y = 0;
    let z = 0;

    for (const position of positions) {
        x += position.x;
        y += position.y;
        z += position.z;
    }

    const length = positions.length;
    return new Cartesian3(x / length, y / length, z / length);
};

export const calculateAreaFromCartesian3Array = (positions: Cartesian3[]): number => {
    if (!positions || positions.length < 3) {
        return 0;
    }

    const center = getCentroidFromCartesian3Array(positions);

    const transform = Transforms.eastNorthUpToFixedFrame(center);
    const inverseTransform = Matrix4.inverse(transform, new Matrix4());

    const localPositions: Cartesian2[] = [];
    for (const position of positions) {
        const localPosition = Matrix4.multiplyByPoint(inverseTransform, position, new Cartesian3());
        localPositions.push(new Cartesian2(localPosition.x, localPosition.y));
    }

    let area = 0;
    const length = localPositions.length;

    for (let i = 0; i < length; i++) {
        const j = (i + 1) % length;

        const p1 = localPositions[i];
        const p2 = localPositions[j];

        area += p1!.x * p2!.y - p2!.x * p1!.y;
    }

    return Math.abs(area) / 2.0;
};

export const getHorizontalPosition = (positions: Cartesian3[]): Cartesian3 => {
    if (positions.length === 2) {
        const pos1 = positions[0]!;
        const pos2 = positions[1]!;

        return new Cartesian3(pos2.z, pos2.y, pos1.x);
    }
    return new Cartesian3();
};

export const calculateHeightFromCartesian3Array = (positions: Cartesian3[]): number => {
    if (positions.length !== 2) {
        return 0;
    }

    const cartographicStart = Cartographic.fromCartesian(
        positions[0]!
    );
    const cartographicEnd = Cartographic.fromCartesian(
        positions[1]!
    );

    if (cartographicStart && cartographicEnd) {
        return Math.abs(cartographicEnd.height - cartographicStart.height);
    }

    return 0;
};
