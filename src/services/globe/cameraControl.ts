import type { Viewer } from "cesium";
import { useCommonStore } from "../stores/common";

export class CameraControl {
    private viewer: Viewer
    public listener = (_: KeyboardEvent) => {};

    constructor(viewer: Viewer) {
        this.viewer = viewer;
    }

    private moveCameraByKeyboard(direction: string, moveAmount: number) {
        const commonStore = useCommonStore();
        if (!commonStore.controlByKeyboard) return;

        const camera = this.viewer.camera;

        switch (direction) {
            case "up":
                camera.moveForward(moveAmount);
                break;
            case "down":
                camera.moveBackward(moveAmount);
                break;
            case "left":
                camera.moveLeft(moveAmount);
                break;
            case "right":
                camera.moveRight(moveAmount);
                break;
        }
    }

    private rotateCameraByKeyboard(axis: string) {
        const commonStore = useCommonStore();
        if (!commonStore.controlByKeyboard) return;

        const camera = this.viewer.camera;
        const rotateAmount = 0.1;

        switch (axis) {
            case "yawLeft":
                camera.setView({
                    destination: camera.position,
                    orientation: {
                        heading: camera.heading - rotateAmount,
                        pitch: camera.pitch,
                        roll: camera.roll,
                    },
                })
                break;
            case "yawRight":
                camera.setView({
                    destination: camera.position,
                    orientation: {
                        heading: camera.heading + rotateAmount,
                        pitch: camera.pitch,
                        roll: camera.roll,
                    },
                })
                break;
            case "pitchUp":
                camera.setView({
                    destination: camera.position,
                    orientation: {
                        heading: camera.heading,
                        pitch: camera.pitch + rotateAmount,
                        roll: camera.roll,
                    },
                })
                break;
            case "pitchDown":
                camera.setView({
                    destination: camera.position,
                    orientation: {
                        heading: camera.heading,
                        pitch: camera.pitch - rotateAmount,
                        roll: camera.roll,
                    },
                })
                break;
        }
    }

    public setupKeyboardControls(moveAmount: number) {
        this.listener = (event: KeyboardEvent) => {
            switch (event.key) {
                case "w":
                    this.moveCameraByKeyboard("up", moveAmount);
                    break;
                case "s":
                    this.moveCameraByKeyboard("down", moveAmount);
                    break;
                case "a":
                    this.moveCameraByKeyboard("left", moveAmount);
                    break;
                case "d":
                    this.moveCameraByKeyboard("right", moveAmount);
                    break;
                case "ArrowLeft":
                    this.rotateCameraByKeyboard("yawLeft");
                    break;
                case "ArrowRight":
                    this.rotateCameraByKeyboard("yawRight");
                    break;
                case "ArrowUp":
                    this.rotateCameraByKeyboard("pitchUp");
                    break;
                case "ArrowDown":
                    this.rotateCameraByKeyboard("pitchDown");
                    break;
            }
        };
        window.addEventListener("keydown", this.listener);
    }

    public removeKeyboardControls() {
        window.removeEventListener("keydown", this.listener);
    }

}