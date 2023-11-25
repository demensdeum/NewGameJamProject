import { GameInputEvent } from "./gameInputEvent"

export class GameInputKeyboardEvent implements GameInputEvent<string> {
    public name: string;
    public value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}