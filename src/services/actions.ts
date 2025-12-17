import { Cartesian3, Math } from '@cesium/engine';
import { globeInstance } from './globe/globe';
import { useCommonStore } from './stores/common';
import { useProjectStore } from './stores/project';
import { useToolsStore } from './stores/tools';
import { markRaw } from 'vue';

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
    });
};

export const ACTIONS = {
    setHomeView,
    exitToMainMenu,
    toggleLayersTree,
    toggleCameraPositionTool,
};

export const ACTION_NAMES = Object.keys(ACTIONS) as Array<keyof typeof ACTIONS>;

export const performAction = (actionName: keyof typeof ACTIONS) => {
    const action = ACTIONS[actionName];
    if (action) {
        action();
    } else {
        console.warn(`Action "${actionName}" not found.`);
    }
};

export type ActionName = keyof typeof ACTIONS;
