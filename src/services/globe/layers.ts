import { Cesium3DTileset, type Viewer } from 'cesium';
import { useLayersStore } from '../stores/layers';
import type { LayerCollectionItem } from '../types/collections';

type LayersTypes = Cesium3DTileset;

export class LayersManager {
    public layers: LayersTypes[] = [];
    public layersMap: Map<string, LayersTypes> = new Map();
    public ready: Promise<void>;
    private viewer: Viewer | null = null;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.ready = this.registerProjectLayers();
    }

    async registerProjectLayers() {
        const layersStore = useLayersStore();
        await layersStore.loadLayers()
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
                    import.meta.env.DEV && console.log('✅🌎 Added 3D Tiles layer:', layerConfig.name);
                }
                break;
            default:
                console.warn('Unknown layer type:', layerConfig.type);
                return null;
        }
    }

    async create3DTilesLayer(resource: { ionId?: number;}) {
        const { ionId } = resource;
        if (ionId) {
            import.meta.env.DEV && console.log('⏱️ Creating 3D Tiles layer from Ion ID:', ionId);
            import.meta.env.DEV && console.log('----------------------------------');
            const tileset = await Cesium3DTileset.fromIonAssetId(ionId, {
                cacheBytes: 1024 * 1024 * 1024,
                maximumCacheOverflowBytes: 512 * 1024 * 1024,
            });
            tileset.maximumScreenSpaceError = 32
            return tileset;
        }
        return null;
    }

    destroy() {
        this.layers = [];
        this.viewer = null;
    }
}
