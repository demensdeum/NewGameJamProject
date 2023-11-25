var IdleState = /** @class */ (function () {
    function IdleState(context) {
        this.name = "Idle";
        this.context = context;
    }
    IdleState.prototype.initialize = function (context) {
        this.context = context;
    };
    IdleState.prototype.inputControllerDidReceive = function (inputController, inputEvent) {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("Method not implemented.");
    };
    IdleState.prototype.step = function () {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("Idle state step");
    };
    return IdleState;
}());
export { IdleState };
