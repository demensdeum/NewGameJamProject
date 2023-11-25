var InputController = /** @class */ (function () {
    function InputController(context, canvas, delegate) {
        this.context = context;
        this.canvas = canvas;
        this.delegate = delegate;
        var inputController = this;
        function onMouseDown(event) {
            inputController.onMouseDown(event);
        }
        ;
        canvas.addEventListener('mousedown', function (e) { return inputController.onMouseDown(e); });
        canvas.addEventListener('mouseup', function (e) { return inputController.onMouseUp(e); });
        canvas.addEventListener('mousemove', function (e) { return inputController.onMouseMove(e); });
        canvas.addEventListener('touchstart', function (e) { return inputController.onTouchStart(e); }, false);
        canvas.addEventListener('touchend', function (e) { return inputController.onTouchEnd(e); }, false);
        canvas.addEventListener('touchmove', function (e) { return inputController.onTouchMove(e); }, false);
    }
    InputController.prototype.onMouseDown = function (event) {
        this.isTouching = true;
        this.context.debugPrint("onMouseDown");
    };
    InputController.prototype.onMouseUp = function (event) {
        this.isTouching = false;
        this.context.debugPrint("onMouseUp");
    };
    InputController.prototype.onMouseMove = function (event) {
        if (!this.isTouching) {
            return;
        }
        this.context.debugPrint("onMouseMove");
    };
    InputController.prototype.onTouchStart = function (event) {
        this.context.debugPrint("onTouchStart");
    };
    InputController.prototype.onTouchEnd = function (event) {
        this.context.debugPrint("onTouchEnd");
    };
    InputController.prototype.onTouchMove = function (event) {
        this.context.debugPrint("onTouchMove");
    };
    return InputController;
}());
export { InputController };
