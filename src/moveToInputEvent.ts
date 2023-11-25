import { InputEvent } from "./inputEvent"

export class MoveToInputEvent implements InputEvent {
    public x: number;
    public y: number;
    public z: number;

    constructor(
        x: number,
        y: number,
        z: number
    )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}