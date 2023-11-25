import { InputControllerDelegate } from "./inputControllerDelegate"
import { Context } from "./context"

export class InputController {

    private isTouching: boolean;
    private context: Context;
    private canvas: HTMLCanvasElement;
    private delegate: InputControllerDelegate;

    constructor(
        context: Context,
        canvas: HTMLCanvasElement,
        delegate: InputControllerDelegate
    )
    {
        this.context = context;
        this.canvas = canvas;
        this.delegate = delegate;

        const inputController = this;
        function onMouseDown(event: MouseEvent) {
            inputController.onMouseDown(event);
        };
        canvas.addEventListener('mousedown', (e)=> inputController.onMouseDown(e));
        canvas.addEventListener('mouseup', (e)=> inputController.onMouseUp(e));
        canvas.addEventListener('mousemove', (e)=> inputController.onMouseMove(e));
        canvas.addEventListener('touchstart', (e)=>inputController.onTouchStart(e), false);
        canvas.addEventListener('touchend', (e)=>inputController.onTouchEnd(e), false);
        canvas.addEventListener('touchmove', (e)=>inputController.onTouchMove(e), false);
    }

    private onMouseDown(event: MouseEvent) {
        this.isTouching = true;
        this.context.debugPrint("onMouseDown");
    }

    private onMouseUp(event: MouseEvent) {
        this.isTouching = false;
        this.context.debugPrint("onMouseUp");
    }    

    private onMouseMove(event: MouseEvent) {
        if (!this.isTouching) {
            return;
        }
        this.context.debugPrint("onMouseMove");
    }      

    private onTouchStart(event: TouchEvent) {
        this.context.debugPrint("onTouchStart");
    }

    private onTouchEnd(event: TouchEvent) {
        this.context.debugPrint("onTouchEnd");
    }

    private onTouchMove(event: TouchEvent) {
        this.context.debugPrint("onTouchMove");
    }
}