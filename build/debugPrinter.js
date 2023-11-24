var DebugPrinter = /** @class */ (function () {
    function DebugPrinter() {
    }
    DebugPrinter.prototype.print = function (text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    };
    return DebugPrinter;
}());
