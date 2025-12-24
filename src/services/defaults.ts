import type { Viewer } from 'cesium';
import type { LayerCollectionItem, QuestCollectionItem, ViewConfigItem } from './types/collections';

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
        globe: false,
    };
};

export const getDefaultLayerConfig = (): LayerCollectionItem => {
    return {
        id: '',
        name: '',
        show: false,
        type: 'cesium3DTiles',
        resource: {
            ionId: 0,
        },
        parentId: 'others',
    };
};

export const getDefaultViewConfig = (): ViewConfigItem => {
    return {
        id: '',
        name: '',
        view: {
            heading: 0,
            pitch: -90,
            x: 0,
            y: 0,
            z: 1000,
        },
    };
};

export const getDefaultQuestConfig = (): QuestCollectionItem => {
    return {
        id: crypto.randomUUID(),
        name: '',
        category: 'sideQuests',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        steps: [
            {
                step: 1,
                title: '',
                description: ''
            }
        ]
    }
}

export const getDefaultStepConfig = (step: number): QuestCollectionItem['steps'][number] => {
    return {
        step: step,
        title: '',
        description: ''
    }
}
