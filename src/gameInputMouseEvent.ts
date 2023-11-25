import { GameInputEvent } from "./gameInputEvent"

export class GameInputMouseEvent implements GameInputEvent<[number, number]> {
    public name: string = "mouse";
    public value: [number, number];

    constructor(value: [number, number]) {
        this.value = value;
    }
}