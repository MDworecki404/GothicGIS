import GEvent from './appEvents';
import { globeInstance } from './globe/globe';
import type { QuestCollectionItem } from './types/collections';
import { zoomToViewConfig } from './utils';

export const questsEvent = new GEvent();

export const layersShowChange = (questItemStep: QuestCollectionItem['steps'][number]) => {
    if (!questItemStep.layersIds) return;

    globeInstance?.layers.layers.forEach((layer) => {
        if (questItemStep.layersIds?.includes(layer.appId!)) {
            layer.show = true;
        } else {
            layer.show = false;
        }
    })
};

export const stepChanges = (questItemStep: QuestCollectionItem['steps'][number]) => {
    if (questItemStep.cameraView) {
        zoomToViewConfig(questItemStep.cameraView, 1.5);
    }
    if (questItemStep.layersIds) {
        layersShowChange(questItemStep);
    }

    questsEvent.raiseEvent(questItemStep);
};
