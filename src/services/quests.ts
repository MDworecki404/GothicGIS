import { Cartesian3, CustomDataSource } from 'cesium';
import GEvent from './appEvents';
import { getDefaultLineStyle, getDefaultPointStyle, getDefaultPolygonStyle } from './globe/draw';
import { globeInstance } from './globe/globe';
import type { QuestCollectionItem } from './types/collections';
import { zoomToViewConfig } from './utils';

export const questsEvent = new GEvent();
export const questDataSource = await globeInstance?.viewer?.dataSources.add(
    new CustomDataSource('thisQuest')
);

export const layersShowChange = (questItemStep: QuestCollectionItem['steps'][number]) => {
    if (!questItemStep.layersIds) return;

    globeInstance?.layers.layers.forEach((layer) => {
        if (questItemStep.layersIds?.includes(layer.appId!)) {
            layer.show = true;
        } else {
            layer.show = false;
        }
    });
};

export const createQuestStepDrawings = (questItemStep: QuestCollectionItem['steps'][number], dataSource: CustomDataSource) => {
    if (!questItemStep.drawings) {
        dataSource?.entities.removeAll();
        return;
    }

    dataSource?.entities.removeAll();
    questItemStep.drawings.forEach((drawing) => {
        switch (drawing.type) {
            case 'point':
                dataSource?.entities.add({
                    id: drawing.id,
                    point: getDefaultPointStyle(),
                    position: drawing.positions.length
                        ? Cartesian3.fromArray([
                              drawing.positions[0]!.x,
                              drawing.positions[0]!.y,
                              drawing.positions[0]!.z,
                          ])
                        : undefined,
                });
                break;
            case 'polyline':
                dataSource?.entities.add({
                    id: drawing.id,
                    polyline: {
                        ...getDefaultLineStyle(),
                        positions: drawing.positions.map((pos) =>
                            Cartesian3.fromArray([pos.x, pos.y, pos.z])
                        ),
                    },
                });
                break;
            case 'polygon':
                dataSource?.entities.add({
                    id: drawing.id,
                    polygon: {
                        ...getDefaultPolygonStyle(),
                        hierarchy: drawing.positions.map((pos) =>
                            Cartesian3.fromArray([pos.x, pos.y, pos.z])
                        ),
                    },
                });
                break;
        }
    });
};

export const stepChanges = (questItemStep: QuestCollectionItem['steps'][number]) => {
    if (questItemStep.cameraView) {
        zoomToViewConfig(questItemStep.cameraView, 1.5);
    }
    if (questItemStep.layersIds) {
        layersShowChange(questItemStep);
    }

    createQuestStepDrawings(questItemStep, questDataSource!);

    questsEvent.raiseEvent(questItemStep);
};
