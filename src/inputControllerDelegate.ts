import { InputController } from "./inputController"
import { GameInputEvent } from "./gameInputEvent"

export interface InputControllerDelegate {
    inputControllerDidReceive<T>(
        inputController: InputController,
        inputEvent: GameInputEvent<T>
    ): void;
}