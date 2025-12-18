import { JulianDate } from 'cesium';
import { globeInstance } from './globe/globe';

export const setDefaultTimeOfDay = () => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;
    const year = new Date().getFullYear();
    viewer.clock.currentTime = JulianDate.fromDate(new Date(year, 2, 20, 12, 0, 0));
};
