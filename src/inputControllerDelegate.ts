import { InputController } from "./inputController"

export interface InputControllerDelegate {
    inputControllerDidReceive(
        inputController: InputController,
        inputEvent: InputEvent
    ): void;
}