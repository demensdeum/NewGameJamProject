import { GameInputMouseEvent } from "./gameInputMouseEvent.js";
var InputController = /** @class */ (function () {
    function InputController(context, canvas, delegate) {
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.currentTouchX = 0;
        this.currentTouchY = 0;
        this.diffX = 0;
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
        this.touchStartX = event.x;
        this.touchStartY = event.y;
        this.currentTouchX = this.touchStartX;
        this.currentTouchY = this.touchStartY;
        this.isTouching = true;
    };
    InputController.prototype.onMouseUp = function (event) {
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
    };
    InputController.prototype.onMouseMove = function (event) {
        this.currentTouchX = event.x;
        this.currentTouchY = event.y;
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
    InputController.prototype.step = function () {
        if (this.isTouching) {
            var xLimit = this.canvas.width;
            var xAspect = (this.currentTouchX - this.touchStartX) / xLimit;
            xAspect = Math.min(xLimit, xAspect);
            var yAspect = this.currentTouchY / this.canvas.height;
            var mouseEvent = new GameInputMouseEvent([xAspect, yAspect]);
            this.delegate.inputControllerDidReceive(this, mouseEvent);
        }
    };
    return InputController;
}());
export { InputController };
