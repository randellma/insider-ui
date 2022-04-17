import {useEffect, useState} from "react";
import {GameControllerService, GameStateDto} from "./generated";
import {PLAYER_ID} from "./constants";

function InsiderComponent() {
    const [gameState, setGameState] = useState<GameStateDto>({});
    const [playerId] = useState<string>(localStorage.getItem(PLAYER_ID) as string);

    useEffect(() => {
        GameControllerService.getState(playerId).then(e => {
            console.log(playerId)
            console.log(e)
            setGameState(e)
        });
    }, [playerId]);

    function getAction(gameAction:string) {
        switch (gameAction) {
            case "CREATE":
                return <div><a onClick={() => GameControllerService.createGame(playerId, "Jim")}>Create</a></div>
            case "JOIN":
                return <div><a>Join</a></div>
            case "READY":
                return <div><a>Ready</a></div>
            case "RESET":
                return <div><a>Ready</a></div>
            case "ASSIGN_ROLES":
                return <div><a>All Ready</a></div>
            case "END":
                break;
        }
    }

    return <div>
        <h1>Insider {gameState.code}</h1>
        <h2>{gameState.status}</h2>
        <h2>Actions</h2>
        {gameState.actions?.map(e => getAction(e))}
        {gameState.players?.map(e => <p key={e.id}>{e.name}</p>)}
    </div>
}

export default InsiderComponent