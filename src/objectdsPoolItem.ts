export class ObjectsPoolItem<T> {
    public isFree: boolean = true;
    public value: T

    constructor(
        isFree: boolean,
        value: T
    )
    {
        this.isFree = isFree;
        this.value = value;
    }
}