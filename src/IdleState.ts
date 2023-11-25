import { State } from "./state.js"
import { Context } from "./context.js"

export class IdleState implements State {
    public name: string = "Idle";
    private context?: Context;

    public initialize(context: Context): void {
        this.context = context;
    }

    public step() {
        this.context?.debugPrint("Idle state step");
    }
}