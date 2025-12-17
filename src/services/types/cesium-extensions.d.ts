import '@cesium/engine'

declare module '@cesium/engine' {
    interface Cesium3DTileset {
        appId?: string;
    }
}