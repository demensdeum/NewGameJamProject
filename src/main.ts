import { Context } from './context.js';
import { InGameState } from './inGameState.js';

function main(argv: {[key: string]: string}) {
    var debugEnabled = argv["debugEnabled"] === "true";

    const initialState = new InGameState("In Game");

    const gameContext = new Context(
        initialState,
        debugEnabled
    );
    
    function step() {
        if (!gameContext.isRunning) {
            return;
        }
        gameContext.step();
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

main(
    {"debugEnabled": "true"}
)