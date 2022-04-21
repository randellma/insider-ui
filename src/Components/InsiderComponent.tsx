import {useCallback, useEffect, useState} from "react";
import {GameControllerService, GameStateDto} from "../generated";
import {PLAYER_ID} from "../constants";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CreateGameComponent from "./CreateGameComponent";
import JoinGameComponent from "./JoinGameComponent";
import PlayerReadyComponent from "./PlayerReadyComponent";
import ConfirmBeginComponent from "./ConfirmBeginComponent";
import ConfirmResetComponent from "./ConfirmResetComponent";
import ConfirmSwapWordComponent from "./ConfirmSwapWordComponent";
import ConfirmStartComponent from "./ConfirmStartComponent";

function InsiderComponent() {
    const [gameState, setGameState] = useState<GameStateDto>({});
    const [playerId] = useState<string>(localStorage.getItem(PLAYER_ID) as string);
    const [createGameOpen, setCreateGameOpen] = useState<boolean>(false);
    const [joinGameOpen, setJoinGameOpen] = useState<boolean>(false);
    const [playerReadyOpen, setPlayerReadyOpen] = useState<boolean>(false);
    const [confirmBeginOpen, setConfirmBeginOpen] = useState<boolean>(false);
    const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);
    const [confirmSwapWordOpen, setConfirmSwapWordOpen] = useState<boolean>(false);
    const [confirmStartOpen, setConfirmStartOpen] = useState<boolean>(false);
    const [showRole, setshowRole] = useState<boolean>(true);

    const getLatestState = useCallback(() => {
        GameControllerService.getState(playerId).then(e => {
            console.log(playerId)
            console.log(e)
            setCreateGameOpen(false)
            setJoinGameOpen(false)
            setPlayerReadyOpen(false)
            setConfirmBeginOpen(false)
            setConfirmResetOpen(false)
            setConfirmSwapWordOpen(false)
            setConfirmStartOpen(false)
            setGameState(e)
        });
    }, [playerId]);

    useEffect(() => {
        getLatestState();
    }, [getLatestState, playerId]);

    function getAction(gameAction: string) {
        switch (gameAction) {
            case "CREATE":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setCreateGameOpen(true)}>Create</Button></div>
            case "JOIN":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setJoinGameOpen(true)}>Join</Button></div>
            case "READY":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setPlayerReadyOpen(true)}>Ready</Button></div>
            case "RESET":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmResetOpen(true)}>Reset</Button></div>
            case "ASSIGN_ROLES":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmBeginOpen(true)}>Begin</Button></div>
            case "EXCHANGE_WORD":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmSwapWordOpen(true)}>Swap Word</Button>
                </div>
            case "START":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmStartOpen(true)}>Start</Button></div>
            default:
                return <div key={gameAction}><Button variant={"outlined"}>{gameAction}</Button></div>
        }
    }

    function getInfoArea() {
        switch (gameState.status) {
            case "WAITING":
                return gameState.players?.map(e => <p key={e.id}>{e.name} - {e.active ? "Ready" : "Not Ready"}</p>)
            case "PRE_GAME":
                return <Stack mt={3} justifyContent="center">
                    <div><Button variant={"contained"}
                                 onClick={() => setshowRole(!showRole)}>{showRole ? "Hide Role" : "Show Role"}</Button>
                    </div>
                    <div style={{display: showRole ? 'block' : 'none'}}>
                        <p>Your Role: {gameState.yourRole}</p>
                        {gameState.secretWord && <p>Secret Word: {gameState.secretWord}</p>}
                    </div>
                </Stack>
        }
    }

    return <div>
        <Typography variant={"h2"} mt={2}>Insider</Typography>
        <Typography variant={"h4"} m={2}>{gameState.code}</Typography>
        <Typography variant={"h5"} m={2}>{gameState.status}</Typography>
        <Stack direction="row" justifyContent="center" spacing={1} m={1}>
            {gameState.actions?.map(e => getAction(e))}
        </Stack>
        {getInfoArea()}
        <CreateGameComponent playerId={playerId} open={createGameOpen} handleClose={getLatestState}/>
        <JoinGameComponent playerId={playerId} open={joinGameOpen} handleClose={getLatestState}/>
        <PlayerReadyComponent playerId={playerId} open={playerReadyOpen} handleClose={getLatestState}/>
        <ConfirmBeginComponent playerId={playerId} open={confirmBeginOpen} handleClose={getLatestState}/>
        <ConfirmResetComponent playerId={playerId} open={confirmResetOpen} handleClose={getLatestState}/>
        <ConfirmSwapWordComponent playerId={playerId} open={confirmSwapWordOpen} handleClose={getLatestState}/>
        <ConfirmStartComponent playerId={playerId} open={confirmStartOpen} handleClose={getLatestState}/>
    </div>
}

export default InsiderComponent