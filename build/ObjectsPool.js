export class ObjectsPool {
    constructor() {
        this.items = [];
    }
    tryPop() {
        const item = this.items.find(n => n.isFree);
        return item !== null && item !== void 0 ? item : null;
    }
    push(item) {
        this.items.push(item);
    }
}
