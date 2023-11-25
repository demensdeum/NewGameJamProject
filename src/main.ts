import { Context } from './context.js';
import { InGameState } from './inGameState.js';

function main(argv: {[key: string]: string}) {
    const debugEnabled = argv["debugEnabled"] === "true";

    const context = new Context(
        debugEnabled
    );
    
    const initialState = new InGameState(
        "In Game",
        context.sceneController
    );

    context.start(initialState);

    function step() {
        if (!context.isRunning) {
            return;
        }
        context.step();
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

main(
    {"debugEnabled": "true"}
)