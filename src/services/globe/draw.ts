import type { Cartesian3, ScreenSpaceEventHandler, Viewer } from 'cesium';
import {
    CallbackProperty,
    Color,
    CustomDataSource,
    Entity,
    HeightReference,
    PolygonHierarchy,
    ScreenSpaceEventType,
} from 'cesium';
import type { GlobeEvents } from './globeEvents';
import type { PointGraphics } from 'cesium';
import type { PolylineGraphics } from 'cesium';
import type { PolygonGraphics } from 'cesium';

export const getDefaultPointStyle = (): PointGraphics.ConstructorOptions => {
    return {
        pixelSize: 10,
        color: Color.fromBytes(176, 106, 9, 255),
        outlineColor: Color.fromBytes(32, 32, 32, 255),
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    };
}

export const getDefaultLineStyle = (): PolylineGraphics.ConstructorOptions => {
    return {
        width: 4,
        material: Color.fromBytes(176, 106, 9, 255),
        clampToGround: true,
    }
}

export const getDefaultPolygonStyle = (): PolygonGraphics.ConstructorOptions => {
    return {
        material: Color.fromBytes(176, 106, 9, 128),
        heightReference: HeightReference.CLAMP_TO_GROUND,
        outline: true,
        outlineColor: Color.fromBytes(32, 32, 32, 255),
        outlineWidth: 2,
    };
}


export class DrawService {
    private _viewer: Viewer;
    private _drawLayer: CustomDataSource | null = null;
    private _temporaryLayer: CustomDataSource | null = null;
    private _eventsService: GlobeEvents;
    private _linePositions: Array<Cartesian3> = [];
    private _previewEntity: Entity | null = null;

    constructor(viewer: Viewer, eventsService: GlobeEvents) {
        this._viewer = viewer;
        this._eventsService = eventsService;

        this.initDrawLayer();
    }

    private initDrawLayer() {
        if (!this._drawLayer) {
            this._drawLayer = new CustomDataSource('draw-layer');
            this._viewer.dataSources.add(this._drawLayer);
            this._drawLayer.show = true;
        }
        if (!this._temporaryLayer) {
            this._temporaryLayer = new CustomDataSource('temporary-draw-layer');
            this._viewer.dataSources.add(this._temporaryLayer);
            this._temporaryLayer.show = true;
        }
    }

    get drawLayer(): CustomDataSource {
        return this._drawLayer!;
    }

    get temporaryLayer(): CustomDataSource {
        return this._temporaryLayer!;
    }

    clearDrawLayer() {
        this.clearPreview();
        this._drawLayer?.entities.removeAll();
        this._linePositions = [];
    }

    clearTemporaryLayer() {
        this._temporaryLayer?.entities.removeAll();
        this._linePositions = [];
        this.clearPreview();
    }

    moveTemporaryToDrawLayer() {
    if (!this._temporaryLayer || !this._drawLayer) return;

    const entities = this._temporaryLayer.entities.values;

    entities.forEach((entity) => {
        if (entity.id === 'preview') return;

        const newEntityOptions: any = {};

        if (entity.position) {
            newEntityOptions.position = entity.position;
        }

        if (entity.point) {
            newEntityOptions.point = entity.point;
        }
        if (entity.polyline) {
            newEntityOptions.polyline = entity.polyline;
        }
        if (entity.polygon) {
            const currentHierarchy = entity.polygon.hierarchy?.getValue(this._viewer.clock.currentTime);

            newEntityOptions.polygon = entity.polygon;
            if (currentHierarchy) {
                newEntityOptions.polygon.hierarchy = currentHierarchy;
            }
        }

        this._drawLayer!.entities.add(newEntityOptions);
    });

    this.clearTemporaryLayer();
}

    selectDrawMode(mode: 'point' | 'line' | 'polygon' | null) {
        switch (mode) {
            case 'point':
                this.drawPoint();
                break;
            case 'line':
                this.drawLine();
                break;
            case 'polygon':
                this.drawPolygon();
                break;
            case null:
                this.finishDrawing();
                break;
        }
    }

    drawPoint() {
        const globeLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
            const pickedObject = this._viewer.scene.pick(event.position);
            if (pickedObject) {
                const cartesian = this._viewer.scene.pickPosition(event.position);
                if (cartesian) {
                    this._temporaryLayer?.entities.add({
                        position: cartesian,
                        point: getDefaultPointStyle(),
                    });
                }
            }
        };

        const globeMouseMove = () => {
            this._viewer.canvas.style.cursor = 'crosshair';
        };

        this._eventsService.setEvent(ScreenSpaceEventType.LEFT_CLICK, globeLeftClick);
        this._eventsService.setEvent(ScreenSpaceEventType.MOUSE_MOVE, globeMouseMove);
    }

    drawLine() {
    if (this.temporaryLayer.entities.getOrCreateEntity('preview')) {
        this.temporaryLayer.entities.removeById('preview');
        this._previewEntity = null;
    }

    let activeCursorPosition: Cartesian3 | null = null;

    const globeLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
        if (!event.position) return;

        const pickedObject = this._viewer.scene.pick(event.position);
        if (pickedObject) {
            const cartesian = this._viewer.scene.pickPosition(event.position);
            if (cartesian) {
                if (this._temporaryLayer?.entities.getById('temporary-line')) {
                    this._temporaryLayer.entities.removeById('temporary-line');
                }

                this._linePositions.push(cartesian);

                if (this._linePositions.length > 1) {
                     this._temporaryLayer?.entities.add({
                        id: 'temporary-line',
                        polyline: {
                            positions: [
                                ...this._linePositions
                            ],
                            ...getDefaultLineStyle(),
                        },
                    });
                }
            }
        }
    };

    const globeMouseMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
        this._viewer.canvas.style.cursor = 'crosshair';
        if (!event.endPosition) return;

        const cartesian = this._viewer.scene.pickPosition(event.endPosition);

        if (cartesian) {
            activeCursorPosition = cartesian;

            if (this._linePositions.length < 1) return;

            if (!this._previewEntity) {
                this._previewEntity = this.temporaryLayer.entities.add({
                    id: 'preview',
                    polyline: {
                        positions: new CallbackProperty(() => {
                            if (!activeCursorPosition) return [];

                            return [
                                this._linePositions[this._linePositions.length - 1],
                                activeCursorPosition
                            ];
                        }, false),
                        ...getDefaultLineStyle(),
                    },
                });
            }
        }
    };

    this._eventsService.setEvent(ScreenSpaceEventType.LEFT_CLICK, globeLeftClick);
    this._eventsService.setEvent(ScreenSpaceEventType.MOUSE_MOVE, globeMouseMove);
}

    drawPolygon() {
        if (this.temporaryLayer.entities.getOrCreateEntity('preview')) {
            this.temporaryLayer.entities.removeById('preview');
            this._previewEntity = null;
        }

        const globeLeftClick = (event: ScreenSpaceEventHandler.PositionedEvent) => {
            if (!event.position) return;
            const pickedObject = this._viewer.scene.pick(event.position);
            if (pickedObject) {
                const cartesian = this._viewer.scene.pickPosition(event.position);
                if (cartesian) {
                    this._linePositions.push(cartesian);

                    if (this._linePositions.length < 3) return;

                    if (this._temporaryLayer?.entities.getById('temporary-polygon')) {
                        this._temporaryLayer.entities.removeById('temporary-polygon');
                    }

                    this._temporaryLayer?.entities.add({
                        id: 'temporary-polygon',
                        polygon: {
                            hierarchy: this._linePositions,
                            ...getDefaultPolygonStyle(),
                        },
                    });
                }
            }
        };

        const globeMouseMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
            this._viewer.canvas.style.cursor = 'crosshair';
            if (!event.endPosition) return;

            const cartesian = this._viewer.scene.pickPosition(event.endPosition);

            if (cartesian) {
                if (this._linePositions.length < 2) return;

                const previewEntity = this.temporaryLayer.entities.getById('preview');

                if (previewEntity) {
                    if (previewEntity.polygon) {
                        previewEntity.polygon.hierarchy = new CallbackProperty(() => {
                            return new PolygonHierarchy([...this._linePositions, cartesian]);
                        }, false) as any;
                    }
                } else {
                    this._previewEntity = new Entity({
                        id: 'preview',
                        polygon: {
                            hierarchy: new CallbackProperty(() => {
                                return new PolygonHierarchy([...this._linePositions, cartesian]);
                            }, false),
                            ...getDefaultPolygonStyle(),
                        },
                    });
                    this.temporaryLayer.entities.add(this._previewEntity);
                }
            }
        };

        this._eventsService.setEvent(ScreenSpaceEventType.LEFT_CLICK, globeLeftClick);
        this._eventsService.setEvent(ScreenSpaceEventType.MOUSE_MOVE, globeMouseMove);
    }

    finishDrawing() {
        this.clearPreview();
        this._eventsService.setDefaultEvents();
        this.moveTemporaryToDrawLayer();
        this._linePositions = [];
    }

    private clearPreview() {
        if (this._previewEntity) {
            this._temporaryLayer?.entities.remove(this._previewEntity);
            this._previewEntity = null;
        }
    }
}
