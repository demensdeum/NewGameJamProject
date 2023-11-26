import { GameInputEvent } from "./gameInputEvent"
import { GameVector2D } from "./gameVector2D";

export class GameInputMouseEvent implements GameInputEvent<GameVector2D> {
    public name: string = "mouse";
    public value: GameVector2D;

    constructor(value: GameVector2D) {
        this.value = value;
    }
}