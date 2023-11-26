import { ObjectsPoolItem } from "./objectdsPoolItem.js";
export class ObjectsPool {
    constructor() {
        this.items = [];
    }
    tryPop() {
        var _a;
        const item = this.items.find(n => n.isFree);
        if (item) {
            item.isFree = false;
        }
        return (_a = item === null || item === void 0 ? void 0 : item.value) !== null && _a !== void 0 ? _a : null;
    }
    push(value) {
        const maybeItem = this.items.find(n => n.value == value);
        if (maybeItem != null) {
            maybeItem.isFree = true;
        }
        else {
            const item = new ObjectsPoolItem(true, value);
            item.isFree = true;
            this.items.push(item);
        }
    }
}
