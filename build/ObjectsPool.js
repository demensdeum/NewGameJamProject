var ObjectsPool = /** @class */ (function () {
    function ObjectsPool() {
        this.items = [];
    }
    ObjectsPool.prototype.tryPop = function () {
        var item = this.items.find(function (n) { return n.isFree; });
        return item !== null && item !== void 0 ? item : null;
    };
    ObjectsPool.prototype.push = function (item) {
        this.items.push(item);
    };
    return ObjectsPool;
}());
export { ObjectsPool };
