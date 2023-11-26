export class IdleState {
    constructor(context) {
        this.name = "Idle";
        this.context = context;
    }
    initialize(context) {
        this.context = context;
    }
    inputControllerDidReceive(inputController, inputEvent) {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("Method not implemented.");
    }
    step() {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("Idle state step");
    }
}
