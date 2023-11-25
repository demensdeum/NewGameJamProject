import { ObjectsPoolItem } from "./objectdsPoolItem.js";

export class ObjectsPool<T> {
    private items: Array<ObjectsPoolItem<T>> = [];

    public tryPop(): ObjectsPoolItem<T> | null {
        const item = this.items.find(n => n.isFree)
        return item ?? null;
    }

    public push(item: ObjectsPoolItem<T>) {
        this.items.push(item);
    }
}