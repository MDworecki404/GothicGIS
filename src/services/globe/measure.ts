import type {
    Cartesian3,
    LabelGraphics,
    PointGraphics,
    PolygonGraphics,
    PolylineGraphics,
    ScreenSpaceEventHandler,
    Viewer,
} from 'cesium';
import {
    CallbackProperty,
    Cartesian2,
    Color,
    CustomDataSource,
    Entity,
    HeightReference,
    LabelStyle,
    PolygonHierarchy,
    ScreenSpaceEventType,
    VerticalOrigin,
} from 'cesium';
import {
    calculateAreaFromCartesian3Array,
    calculateDistanceFromCartesian3Array,
    calculateHeightFromCartesian3Array,
    getCentroidFromCartesian3Array
} from '../utils';
import type { GlobeEvents } from './globeEvents';
import { PolylineDashMaterialProperty } from 'cesium';

const getDefaultPointStyle = (): PointGraphics.ConstructorOptions => {
    return {
        pixelSize: 6,
        color: Color.fromBytes(176, 48, 9, 255),
        outlineColor: Color.fromBytes(99, 29, 29, 255),
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    };
};

const getDefaultLabelStyle = (text: string): LabelGraphics.ConstructorOptions => {
    return {
        text: text,
        font: '16px sans-serif',
        fillColor: Color.fromBytes(255, 255, 255, 255),
        outlineColor: Color.fromBytes(32, 32, 32, 255),
        outlineWidth: 3,
        style: LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: VerticalOrigin.BOTTOM,
        pixelOffset: new Cartesian2(0, -12),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    };
};

const getDefaultLineStyle = (): PolylineGraphics.ConstructorOptions => {
    return {
        width: 4,
        material: new PolylineDashMaterialProperty({
            color: Color.fromBytes(176, 48, 9, 255),
            gapColor: Color.TRANSPARENT,
            dashLength: 16,
        }),
        clampToGround: true,
    };
};

const getDefaultPolygonStyle = (): PolygonGraphics.ConstructorOptions => {
    return {
        material: Color.fromBytes(176, 48, 9, 255).withAlpha(0.4),
        heightReference: HeightReference.CLAMP_TO_GROUND,
        outline: true,
        outlineColor: Color.fromBytes(99, 29, 29, 255),
        outlineWidth: 3,
    };
};

export class MeasurementService {
    private _viewer: Viewer;
    private _measurementLayer: CustomDataSource | null = null;
    private _temporaryLayer: CustomDataSource | null = null;
    private _eventsService: GlobeEvents;
    private _linePositions: Array<Cartesian3> = [];
    private _previewEntity: Entity | null = null;

    constructor(viewer: Viewer, eventsService: GlobeEvents) {
        this._viewer = viewer;
        this._eventsService = eventsService;

        this.initMeasurementLayer();
    }

    private initMeasurementLayer() {
        if (!this._measurementLayer) {
            this._measurementLayer = new CustomDataSource('measurement-layer');
            this._viewer.dataSources.add(this._measurementLayer);
            this._measurementLayer.show = true;
        }
        if (!this._temporaryLayer) {
            this._temporaryLayer = new CustomDataSource('temporary-measurement-layer');
            this._viewer.dataSources.add(this._temporaryLayer);
            this._temporaryLayer.show = true;
        }
    }

    get measurementLayer(): CustomDataSource {
        return this._measurementLayer!;
    }

    get temporaryLayer(): CustomDataSource {
        return this._temporaryLayer!;
    }

    clearMeasurementLayer() {
        this.clearPreview();
        this._measurementLayer?.entities.removeAll();
        this._linePositions = [];
    }

    clearTemporaryLayer() {
        this._temporaryLayer?.entities.removeAll();
        this._linePositions = [];
        this.clearPreview();
    }

    moveTemporaryToMeasurementLayer() {
        if (!this._temporaryLayer || !this._measurementLayer) return;

        const entities = this._temporaryLayer.entities.values;

        entities.forEach((entity) => {
            if (entity.id === 'preview') return;

            const newEntityOptions: any = {};

            if (entity.label) {
                newEntityOptions.label = entity.label;
            }

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
                const currentHierarchy = entity.polygon.hierarchy?.getValue(
                    this._viewer.clock.currentTime
                );

                newEntityOptions.polygon = entity.polygon;
                if (currentHierarchy) {
                    newEntityOptions.polygon.hierarchy = currentHierarchy;
                }
            }

            this._measurementLayer!.entities.add(newEntityOptions);
        });

        this.clearTemporaryLayer();
    }

    selectMeasurementMode(mode: 'distance' | 'area' | 'height' | null) {
        switch (mode) {
            case 'distance':
                this.measureDistance();
                break;
            case 'area':
                this.measureArea();
                break;
            case 'height':
                this.measureHeight();
                break;
            case null:
                this.finishMeasurement();
                break;
        }
    }

    measureDistance() {
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
                    this._linePositions.push(cartesian);

                    if (this._linePositions.length > 1) {
                        const distance = calculateDistanceFromCartesian3Array(this._linePositions);
                        this._temporaryLayer?.entities.add({
                            polyline: {
                                positions: [
                                    this._linePositions[this._linePositions.length - 2]!,
                                    this._linePositions[this._linePositions.length - 1]!,
                                ],
                                ...getDefaultLineStyle(),
                            },
                            label: getDefaultLabelStyle(`${distance.toFixed(2)} m`),
                            position: this._linePositions[this._linePositions.length - 1]!,
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
                                    activeCursorPosition,
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

    measureArea() {
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

                    const area = calculateAreaFromCartesian3Array(this._linePositions);
                    const areaText =
                        area >= 100000
                            ? `${(area / 1000000).toFixed(2)} km²`
                            : `${area.toFixed(2)} m²`;

                    this._temporaryLayer?.entities.add({
                        id: 'temporary-polygon',
                        polygon: {
                            hierarchy: this._linePositions,
                            ...getDefaultPolygonStyle(),
                        },
                        label: getDefaultLabelStyle(areaText),
                        position: getCentroidFromCartesian3Array(this._linePositions),
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

    measureHeight() {
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

                    this._temporaryLayer?.entities.add({
                        point: getDefaultPointStyle(),
                        position: cartesian,
                    });

                    if (this._linePositions.length === 2) {
                        const diagonalLine = new Entity({
                            polyline: {
                                positions: [this._linePositions[0]!, this._linePositions[1]!],
                                ...getDefaultLineStyle(),
                                clampToGround: false,
                            },
                            label: getDefaultLabelStyle(
                                `${calculateHeightFromCartesian3Array(this._linePositions).toFixed(
                                    2
                                )} m`
                            ),
                            position: this._linePositions[0]!,
                        });

                        this._temporaryLayer?.entities.add(diagonalLine);

                        this._linePositions = [];
                    }
                }
            }
        };

        const globeMouseMove = (event: ScreenSpaceEventHandler.MotionEvent) => {
            this._viewer.canvas.style.cursor = 'crosshair';
            if (!event.endPosition) return;

            const cartesian = this._viewer.scene.pickPosition(event.endPosition);

            if (cartesian) {
                const previewEntity = this.temporaryLayer.entities.getById('preview');

                if (previewEntity) {
                    if (previewEntity.point) {
                        previewEntity.position = new CallbackProperty(() => {
                            return cartesian;
                        }, false) as any;
                    }
                } else {
                    this._previewEntity = new Entity({
                        id: 'preview',
                        point: getDefaultPointStyle(),
                        position: cartesian,
                    });
                    this.temporaryLayer.entities.add(this._previewEntity);
                }
            }
        };

        this._eventsService.setEvent(ScreenSpaceEventType.LEFT_CLICK, globeLeftClick);
        this._eventsService.setEvent(ScreenSpaceEventType.MOUSE_MOVE, globeMouseMove);
    }

    finishMeasurement() {
        this.clearPreview();
        this._eventsService.setDefaultEvents();
        this.moveTemporaryToMeasurementLayer();
        this._linePositions = [];
    }

    private clearPreview() {
        if (this._previewEntity) {
            this._temporaryLayer?.entities.remove(this._previewEntity);
            this._previewEntity = null;
        }
    }
}
