import type { ScreenSpaceEventHandler, Viewer } from 'cesium';
import { ScreenSpaceEventType } from 'cesium';

export class GlobeEvents {
    private _viewer: Viewer;

    constructor(viewer: Viewer) {
        this._viewer = viewer;
    }

    setDefaultEvents() {
        this._viewer.canvas.style.cursor = 'default';
        this._viewer.screenSpaceEventHandler.setInputAction(() => {},
        ScreenSpaceEventType.LEFT_CLICK);
        this._viewer.screenSpaceEventHandler.setInputAction(() => {},
        ScreenSpaceEventType.MOUSE_MOVE);
    }

    setEvent<T = ScreenSpaceEventHandler>(
        type: ScreenSpaceEventType,
        action: (event: any | T) => void
    ) {
        this._viewer.screenSpaceEventHandler.setInputAction(action, type);
    }
}
