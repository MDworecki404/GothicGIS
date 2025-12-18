import { Cesium3DTileset, type Viewer } from 'cesium';
import { useLayersStore } from '../stores/layers';
import type { LayerCollectionItem } from '../types/collections';

type LayersTypes = Cesium3DTileset;

export class LayersManager {
    public layers: LayersTypes[] = [];
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
                    console.warn('Error creating layer', layer, e);
                }
            })
        );
    }

    async layersFactory(layerConfig: LayerCollectionItem) {
        console.log('Adding layer:', layerConfig.name);
        switch (layerConfig.type) {
            case 'cesium3DTiles':
                const cesiumLayer = await this.create3DTilesLayer(layerConfig.resource);
                cesiumLayer!.appId = layerConfig.id;
                cesiumLayer!.show = layerConfig.show;
                if (cesiumLayer && this.viewer) {
                    this.viewer.scene.primitives.add(cesiumLayer);
                    this.layers.push(cesiumLayer);
                    console.log('Added 3D Tiles layer:', layerConfig.name);
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
            console.log('Creating 3D Tiles layer from Ion ID:', ionId);
            const tileset = await Cesium3DTileset.fromIonAssetId(ionId);
            return tileset;
        }
        return null;
    }

    destroy() {
        this.layers = [];
        this.viewer = null;
    }
}
