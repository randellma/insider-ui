import {useCallback, useEffect, useState} from "react";
import {GameControllerService, GameStateDto} from "../generated";
import {PLAYER_ID} from "../constants";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CreateGameComponent from "./CreateGameComponent";
import JoinGameComponent from "./JoinGameComponent";

function InsiderComponent() {
    const [gameState, setGameState] = useState<GameStateDto>({});
    const [playerId] = useState<string>(localStorage.getItem(PLAYER_ID) as string);
    const [createGameOpen, setCreateGameOpen] = useState<boolean>(false);
    const [joinGameOpen, setJoinGameOpen] = useState<boolean>(false);

    const getLatestState = useCallback(() => {
        GameControllerService.getState(playerId).then(e => {
            console.log(playerId)
            console.log(e)
            setCreateGameOpen(false)
            setJoinGameOpen(false)
            setGameState(e)
        });
    }, [playerId]);

    useEffect(() => {
        getLatestState();
    }, [getLatestState, playerId]);

    function getAction(gameAction:string) {
        switch (gameAction) {
            case "CREATE":
                // return <div key={gameAction}><Button variant={"outlined"} onClick={() => GameControllerService.createGame(playerId, "Jim")}>Create</Button></div>
                return <div key={gameAction}><Button variant={"outlined"} onClick={() => setCreateGameOpen(true)}>Create</Button></div>
            case "JOIN":
                return <div key={gameAction}><Button variant={"outlined"} onClick={() => setJoinGameOpen(true)}>Join</Button></div>
            case "READY":
                return <div key={gameAction}><Button variant={"outlined"}>Ready</Button></div>
            case "RESET":
                return <div key={gameAction}><Button variant={"outlined"}>Reset</Button></div>
            case "ASSIGN_ROLES":
                return <div key={gameAction}><Button variant={"outlined"}>Assign Roles</Button></div>
            case "END":
                return <div key={gameAction}><Button variant={"outlined"}>{gameAction}</Button></div>
        }
    }

    return <div>
        <Typography variant={"h2"} mt={2}>Insider</Typography>
        <Typography variant={"h4"} m={2}>{gameState.code}</Typography>
        <Typography variant={"h5"} m={2}>{gameState.status}</Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
            {gameState.actions?.map(e => getAction(e))}
        </Stack>
        {gameState.players?.map(e => <p key={e.id}>{e.name} - {e.active ? "Ready" : "Not Ready"}</p>)}
        <CreateGameComponent playerId={playerId} open={createGameOpen} handleClose={getLatestState}/>
        <JoinGameComponent playerId={playerId} open={joinGameOpen} handleClose={getLatestState}/>
    </div>
}

export default InsiderComponent