import {
    Cartesian3,
    Cesium3DTileset,
    HeadingPitchRoll,
    Matrix4,
    Transforms,
    TranslationRotationScale,
    type Viewer,
} from 'cesium';
import { useLayersStore } from '../stores/layers';
import type { LayerCollectionItem } from '../types/collections';

type LayersTypes = Cesium3DTileset;

export class LayersManager {
    public layers: LayersTypes[] = [];
    public layersMap: Map<string, LayersTypes> = new Map();
    public originalModelMatrices: Map<string, Matrix4> = new Map();
    public originalCenters: Map<string, Cartesian3> = new Map();
    public ready: Promise<void>;
    private viewer: Viewer | null = null;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.ready = this.registerProjectLayers();
    }

    async registerProjectLayers() {
        const layersStore = useLayersStore();
        await layersStore.loadLayers();
        await Promise.all(
            layersStore.layers.map(async (layer) => {
                try {
                    await this.layersFactory(layer);
                } catch (e) {
                    layer.show = false;
                    layersStore.invalidateLayers.set(layer.id, layer);
                    console.warn('Error creating layer', layer, e);
                }
            })
        );
    }

    async layersFactory(layerConfig: LayerCollectionItem) {
        import.meta.env.DEV && console.log('⏱️ Adding layer:', layerConfig.name);
        switch (layerConfig.type) {
            case 'cesium3DTiles':
                const cesiumLayer = await this.create3DTilesLayer(layerConfig.resource);
                cesiumLayer!.appId = layerConfig.id;
                cesiumLayer!.show = layerConfig.show;
                if (cesiumLayer && this.viewer) {
                    this.viewer.scene.primitives.add(cesiumLayer);
                    this.layers.push(cesiumLayer);
                    this.layersMap.set(layerConfig.id, cesiumLayer);

                    this.originalModelMatrices.set(
                        layerConfig.id,
                        Matrix4.clone(cesiumLayer.modelMatrix ?? new Matrix4())
                    );
                    this.originalCenters.set(
                        layerConfig.id,
                        Cartesian3.clone(cesiumLayer.boundingSphere.center)
                    );

                    if (layerConfig.transformation) {
                        this.transformLayerCoordinates({
                            parameters: layerConfig.transformation,
                            layerId: layerConfig.id,
                        });
                    }

                    import.meta.env.DEV &&
                        console.log('✅🌎 Added 3D Tiles layer:', layerConfig.name);
                }
                break;
            default:
                console.warn('Unknown layer type:', layerConfig.type);
                return null;
        }
    }

    async create3DTilesLayer(resource: { ionId?: number }) {
        const { ionId } = resource;
        if (ionId) {
            import.meta.env.DEV && console.log('⏱️ Creating 3D Tiles layer from Ion ID:', ionId);
            import.meta.env.DEV && console.log('----------------------------------');
            const tileset = await Cesium3DTileset.fromIonAssetId(ionId, {
                cacheBytes: 1024 * 1024 * 1024,
                maximumCacheOverflowBytes: 512 * 1024 * 1024,
            });
            tileset.maximumScreenSpaceError = 32;
            return tileset;
        }
        return null;
    }

    transformLayerCoordinates({
        parameters,
        layerId,
    }: {
        parameters: LayerCollectionItem['transformation'];
        layerId: string;
    }) {
        const layer = this.layersMap.get(layerId);
        if (layer && parameters) {
            if (parameters.scale === 0) {
                return;
            }
            const originalCenter = this.originalCenters.get(layerId) ?? layer.boundingSphere.center;
            const originalModel =
                this.originalModelMatrices.get(layerId) ??
                Matrix4.clone(layer.modelMatrix ?? new Matrix4());

            const offset = new Cartesian3(
                parameters.translate?.x ?? 0,
                parameters.translate?.y ?? 0,
                parameters.translate?.z ?? 0
            );

            // Convert local ENU offset to ECEF (fixed) frame at the layer center
            const enuToFixed = Transforms.eastNorthUpToFixedFrame(originalCenter);
            const worldOffset = Matrix4.multiplyByPointAsVector(
                enuToFixed,
                offset,
                new Cartesian3()
            );
            const centerPlusOffset = Cartesian3.add(originalCenter, worldOffset, new Cartesian3());

            const hpr = new HeadingPitchRoll(
                (parameters.rotate?.heading ?? 0) * (Math.PI / 180),
                (parameters.rotate?.pitch ?? 0) * (Math.PI / 180),
                (parameters.rotate?.roll ?? 0) * (Math.PI / 180)
            );

            // Rotation quaternion in fixed frame for given center
            const rotation = Transforms.headingPitchRollQuaternion(originalCenter, hpr);

            const scale = new Cartesian3(
                parameters.scale ?? 1,
                parameters.scale ?? 1,
                parameters.scale ?? 1
            );

            const translateToOrigin = Matrix4.fromTranslation(
                Cartesian3.negate(originalCenter, new Cartesian3())
            );
            const rotScale = Matrix4.fromTranslationRotationScale(
                new TranslationRotationScale(new Cartesian3(0, 0, 0), rotation, scale)
            );
            const translateBack = Matrix4.fromTranslation(centerPlusOffset);

            const tmp1 = new Matrix4();
            Matrix4.multiply(translateToOrigin, originalModel, tmp1); // T(-center) * originalModel
            const tmp2 = new Matrix4();
            Matrix4.multiply(rotScale, tmp1, tmp2); // R*S * T(-center) * originalModel
            const finalMat = new Matrix4();
            Matrix4.multiply(translateBack, tmp2, finalMat); // T(center+offset) * ...

            layer.modelMatrix = finalMat;
        }
    }

    destroy() {
        this.layers = [];
        this.viewer = null;
    }
}
