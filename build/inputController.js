import { GameInputMouseEvent } from "./gameInputMouseEvent.js";
import { GameVector2D } from "./gameVector2D.js";
export class InputController {
    constructor(context, canvas, delegate) {
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.currentTouchX = 0;
        this.currentTouchY = 0;
        this.diffX = 0;
        this.context = context;
        this.canvas = canvas;
        this.delegate = delegate;
        const inputController = this;
        function onMouseDown(event) {
            inputController.onMouseDown(event);
        }
        ;
        canvas.addEventListener('mousedown', (e) => inputController.onMouseDown(e));
        canvas.addEventListener('mouseup', (e) => inputController.onMouseUp(e));
        canvas.addEventListener('mousemove', (e) => inputController.onMouseMove(e));
        canvas.addEventListener('touchstart', (e) => inputController.onTouchStart(e), false);
        canvas.addEventListener('touchend', (e) => inputController.onTouchEnd(e), false);
        canvas.addEventListener('touchmove', (e) => inputController.onTouchMove(e), false);
    }
    onMouseDown(event) {
        this.touchStartX = event.x;
        this.touchStartY = event.y;
        this.currentTouchX = this.touchStartX;
        this.currentTouchY = this.touchStartY;
        this.isTouching = true;
    }
    onMouseUp(event) {
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
    }
    onMouseMove(event) {
        this.currentTouchX = event.x;
        this.currentTouchY = event.y;
    }
    onTouchStart(event) {
        this.context.debugPrint("onTouchStart");
    }
    onTouchEnd(event) {
        this.context.debugPrint("onTouchEnd");
    }
    onTouchMove(event) {
        this.context.debugPrint("onTouchMove");
    }
    step() {
        if (this.isTouching) {
            const xLimit = this.canvas.width;
            var xAspect = (this.currentTouchX - this.touchStartX) / xLimit;
            xAspect = Math.min(xLimit, xAspect);
            const yAspect = this.currentTouchY / this.canvas.height;
            const mouseEvent = new GameInputMouseEvent(new GameVector2D(xAspect, yAspect));
            this.delegate.inputControllerDidReceive(this, mouseEvent);
        }
    }
}
