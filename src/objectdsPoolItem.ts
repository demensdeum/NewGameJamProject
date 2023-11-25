export class ObjectsPoolItem<T> {
    public isFree: boolean = true;
    public value: T

    constructor(
        value: T
    )
    {
        this.value = value;
    }
}