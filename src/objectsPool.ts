import { ObjectsPoolItem } from "./objectdsPoolItem.js";

export class ObjectsPool<T> {
    private items: Array<ObjectsPoolItem<T>> = [];

    public tryPop(): T | null {
        const item = this.items.find(n => n.isFree)
        if (item) {
            item.isFree = false;
        }
        return item?.value ?? null;
    }

    public push(value: T) {
        const maybeItem = this.items.find(n => n.value == value);
        if (maybeItem != null) {
            maybeItem.isFree = true;
        }
        else {
            const item = new ObjectsPoolItem(
                true,
               value
            );
            item.isFree = true;
            this.items.push(item);
        }
    }
}