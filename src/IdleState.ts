import { State } from "./state.js"
import { Context } from "./context.js"
import { InputControllerDelegate } from "./inputControllerDelegate.js";
import { GameInputEvent } from "./gameInputEvent.js";
import { InputController } from "./inputController.js";

export class IdleState implements State, InputControllerDelegate {

    public name: string = "Idle";
    private context: Context;

    constructor(
        context: Context
    )
    {
        this.context = context;
    }

    public initialize(context: Context): void {
        this.context = context;
    }

    inputControllerDidReceive<T>(inputController: InputController, inputEvent: GameInputEvent<T>): void {
        this.context?.debugPrint("Method not implemented.");
    }    

    public step() {
        this.context?.debugPrint("Idle state step");
    }
}