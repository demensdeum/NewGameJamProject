var IdleState = /** @class */ (function () {
    function IdleState() {
        this.name = "Idle";
    }
    IdleState.prototype.initialize = function (context) {
        this.context = context;
    };
    IdleState.prototype.step = function () {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("Idle state step");
    };
    return IdleState;
}());
export { IdleState };
