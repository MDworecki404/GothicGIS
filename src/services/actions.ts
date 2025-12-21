import { Cartesian3, Math } from 'cesium';
import { globeInstance } from './globe/globe';
import { useCommonStore } from './stores/common';
import { useProjectStore } from './stores/project';
import { useToolsStore } from './stores/tools';
import { markRaw } from 'vue';
import { useLayersStore } from './stores/layers';
import { useDialogStore } from './stores/dialog';

///////////////////////////////
//MARK: - Utils actions
///////////////////////////////

const setHomeView = () => {
    const { workingProject } = useProjectStore();

    const viewer = globeInstance?.viewer;
    if (!viewer) return;

    const homePosition = {
        destination: Cartesian3.fromArray([
            workingProject?.initView?.x ?? 0,
            workingProject?.initView?.y ?? 0,
            workingProject?.initView?.z ?? 10000000
        ]),
        orientation: {
            heading: workingProject?.initView?.heading ?? 0,
            pitch: workingProject?.initView?.pitch ?? -Math.PI_OVER_TWO,
            roll: 0,
        },
        duration: 1
    };

    viewer.camera.flyTo(homePosition);
};

const exitToMainMenu = () => {
    const projectStore = useProjectStore();
    const commonStore = useCommonStore();
    projectStore.unsetWorkingProject();
    commonStore.setAppLoaded(false);

    globeInstance?.destroy();
};

const toggleLayerVisibility = (layerId: string) => {
    const layersStore = useLayersStore();
    const layer = layersStore.layers.find(l => l.id === layerId);
    if (layer) {
        layer.show = !layer.show;
        globeInstance!.layers.layers.find(l => l.appId === layerId)!.show = layer.show;
    }
}

const zoomIn = () => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;
    const cameraHeight = viewer.camera.positionCartographic.height;

    viewer.camera.zoomIn(cameraHeight * 0.8);
}

const zoomOut = () => {
    const viewer = globeInstance?.viewer;
    if (!viewer) return;
    const cameraHeight = viewer.camera.positionCartographic.height;

    viewer.camera.zoomOut(cameraHeight * 1.2);
}

///////////////////////////////
//MARK: - Tools toggling
///////////////////////////////
const toggleLayersTree = async () => {
    const toolsStore = useToolsStore();
    const layerTreeComponent = markRaw(await import('../components/tools/LayersTree.vue'));
    const component = layerTreeComponent.default;
    toolsStore.registerTool({
        id: 'layersTree',
        name: 'layersTree',
        icon: 'mdi-file-tree-outline',
        component: component,
        props: {
            width: 400,
        }
    });
};

const toggleCameraPositionTool = async () => {
    const toolsStore = useToolsStore();
    const cameraPositionComponent = markRaw(await import('../components/tools/CameraPosition.vue'));
    const component = cameraPositionComponent.default;
    toolsStore.registerTool({
        id: 'cameraPosition',
        name: 'cameraPosition',
        icon: 'mdi-camera-outline',
        component: component,
        props: {
            width: 400,
        }
    });
};

const toggleShadowSettings = async () => {
    const toolsStore = useToolsStore();
    const shadowSettingsComponent = markRaw(await import('../components/tools/ShadowsSettings.vue'));
    const component = shadowSettingsComponent.default;
    toolsStore.registerTool({
        id: 'shadowSettings',
        name: 'shadowSettings',
        icon: 'mdi-sun-clock-outline',
        component: component,
        props: {
            width: 400,
        }
    });
}

const toggleSettingsTool = async () => {
    const toolsStore = useToolsStore();
    const settingsComponent = markRaw(await import('../components/tools/SettingsTool.vue'));
    const component = settingsComponent.default;
    toolsStore.registerTool({
        id: 'settingsTool',
        name: 'settingsTool',
        icon: 'mdi-cog-outline',
        component: component,
        props: {
            width: 400,
        }
    });
}

const toggleProjectEditor = async () => {
    const dialogStore = useDialogStore()
    const projectEditorComponent = markRaw(await import('../components/Editors/ProjectEditor.vue'));
    const component = projectEditorComponent.default
    dialogStore.showDialog({
        component: component,
        dialogStyle: {
            width: 600,
        }
    })
}

const toggleLayerEditor = async () => {
    const toolsStore = useToolsStore();
    const layerEditorComponent = markRaw(await import('../components/Editors/LayersEditor.vue'));
    const component = layerEditorComponent.default;
    toolsStore.registerTool({
        id: 'layersEditor',
        name: 'layersEditor',
        icon: 'mdi-file-edit-outline',
        component: component,
        props: {
            width: 600,
        }
    });
}

const toggleViewsEditor = async () => {
    const toolsStore = useToolsStore();
    const viewsEditorComponent = markRaw(await import('../components/Editors/ViewsEditor.vue'));
    const component = viewsEditorComponent.default;
    toolsStore.registerTool({
        id: 'viewsEditor',
        name: 'viewsEditor',
        icon: 'mdi-eye-outline',
        component: component,
        props: {
            width: 600,
        }
    });
}

///////////////////////////////
//MARK: - Exported actions
///////////////////////////////

export const ACTIONS = {
    setHomeView,
    exitToMainMenu,
    toggleLayersTree,
    toggleCameraPositionTool,
    toggleLayerVisibility,
    zoomIn,
    zoomOut,
    toggleShadowSettings,
    toggleSettingsTool,
    toggleProjectEditor,
    toggleLayerEditor,
    toggleViewsEditor,
};

export const ACTION_NAMES = Object.keys(ACTIONS) as Array<keyof typeof ACTIONS>;

export const performAction = (actionName: keyof typeof ACTIONS, args?: any) => {
    const action = ACTIONS[actionName];
    if (action) {
        action(args);
    } else {
        console.warn(`Action "${actionName}" not found.`);
    }
};

export type ActionName = keyof typeof ACTIONS;
