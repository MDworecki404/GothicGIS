import { Cartesian3, Math } from "@cesium/engine"
import { globeInstance } from "./globe/globe"
import { useProjectStore } from "./stores/project"
import { useCommonStore } from "./stores/common"

const zoomToHome = () => {
    const viewer = globeInstance?.viewer
    if (!viewer) return

    const homePosition = {
        destination: Cartesian3.fromDegrees(0, 0, 10000000),
        orientation: {
            heading: Math.toRadians(0),
            pitch: Math.toRadians(-90),
            roll: 0,
        },
    }

    viewer.camera.flyTo(homePosition)
}

const exitToMainMenu = () => {
    const projectStore = useProjectStore()
    const commonStore = useCommonStore()
    projectStore.unsetWorkingProject()
    commonStore.setAppLoaded(false)


    globeInstance?.destroy()

}

export const ACTIONS = {
    zoomToHome,
    exitToMainMenu,
}

export const ACTION_NAMES = Object.keys(ACTIONS) as Array<keyof typeof ACTIONS>;

export const performAction = (actionName: keyof typeof ACTIONS) => {
    const action = ACTIONS[actionName]
    if (action) {
        action()
    } else {
        console.warn(`Action "${actionName}" not found.`)
    }
}

export type ActionName = keyof typeof ACTIONS