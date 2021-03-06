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
import ConfirmGuessedComponent from "./ConfirmGuessedComponent";
import ConfirmTimeupComponent from "./ConfirmTimeupComponent";
import Countdown from 'react-countdown';
import CastVoteComponent from "./CastVoteComponent";
import ConfirmVotingCompleteComponent from "./ConfirmVotingCompleteComponent";
import useInterval from "../hooks/useInterval"

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
    const [confirmGuessedOpen, setConfirmGuessedOpen] = useState<boolean>(false);
    const [confirmTimeupOpen, setConfirmTimeUpOpen] = useState<boolean>(false);
    const [castVoteOpen, setCastVoteOpen] = useState<boolean>(false);
    const [confirmCompleteOpen, setConfirmCompleteOpen] = useState<boolean>(false);
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
            setConfirmGuessedOpen(false)
            setConfirmTimeUpOpen(false)
            setCastVoteOpen(false)
            setConfirmCompleteOpen(false)
            setGameState(e)
        });
    }, [playerId]);

    useEffect(() => {
        getLatestState();
    }, [getLatestState, playerId]);

    const isDialogOpen = () => {
        return createGameOpen || joinGameOpen || playerReadyOpen || confirmBeginOpen || confirmResetOpen
            || confirmSwapWordOpen || confirmStartOpen || confirmGuessedOpen || confirmTimeupOpen
            || castVoteOpen || confirmCompleteOpen;
    }

    useInterval(async() => {
        console.log("interval");
        if(gameState.code && !isDialogOpen()) {
            getLatestState();
        }
    }, 3000);

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
                return <div key={gameAction}><Button variant={"outlined"} onClick={() => setConfirmSwapWordOpen(true)}>Swap Word</Button>
                </div>
            case "START":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmStartOpen(true)}>Start</Button></div>
            case "GUESSED":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmGuessedOpen(true)}>Guessed</Button></div>
            case "TIME_UP":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmTimeUpOpen(true)}>Time Up</Button></div>
            case "VOTE_PLAYER":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setCastVoteOpen(true)}>Cast Vote</Button></div>
            case "COMPLETE_VOTING":
                return <div key={gameAction}><Button variant={"outlined"}
                                                     onClick={() => setConfirmCompleteOpen(true)}>Voting Complete</Button></div>
            default:
                return <div key={gameAction}><Button variant={"outlined"}>{gameAction}</Button></div>
        }
    }

    function getRoleInfo() {
        return <>
            <div><Button variant={"contained"}
                         onClick={() => setshowRole(!showRole)}>{showRole ? "Hide Role" : "Show Role"}</Button>
            </div>
            <div style={{display: showRole ? 'block' : 'none'}}>
                <p>Your Role: {gameState.yourRole}</p>
                {gameState.secretWord && <p>Secret Word: {gameState.secretWord}</p>}
            </div>
        </>;
    }

    function getInfoArea() {
        switch (gameState.status) {
            case "WAITING":
                return gameState.players?.map(e => <p key={e.id}>{e.name} - {e.active ? "Ready" : "Not Ready"}</p>)
            case "PRE_GAME":
                return <Stack mt={3} justifyContent="center">{getRoleInfo()}</Stack>
            case "SUMMARY":
                const summary = gameState.gameSummary;
                const votes = summary?.votes || {}
                const voteArray = []
                for (const property in votes) {
                    voteArray.push({player: property, count: votes[property]})
                }
                voteArray.sort((x,y) => y.count - x.count);
                let accusedPlayer = null;
                let validVotes = voteArray.filter(vote => vote.player != 'no vote')
                if((validVotes.length > 1 && validVotes[0] > validVotes[1]) || validVotes.length === 1) {
                    accusedPlayer = validVotes[0]
                }
                const insiderLost = accusedPlayer?.player === summary?.insider
                return <Stack mt={3} justifyContent="center">
                    <p><strong>Insider</strong>: {summary?.insider}</p>
                    <p><strong>Secret Word</strong>: {summary?.secretWord}</p>
                    <p><strong>Winner</strong>: {insiderLost ? "The Commons" : "The Insider"}</p>
                    <p><strong>Votes</strong></p>
                    {voteArray.map(e => <p key={e.player}>{e.player}: {e.count}</p>)}
                </Stack>
            case "LOST":
                return <Stack mt={3} justifyContent="center">
                    <p>Everyone Lost <span role="img" aria-label="loudly crying face">????</span></p>
                    <p>Insider: {gameState.gameSummary?.insider}</p>
                    <p>Secret Word: {gameState.gameSummary?.secretWord}</p>
                </Stack>
            case "PLAYING":
                return <div>
                    <Countdown
                        overtime
                        daysInHours={true}
                        date={Date.parse(gameState.playStartTime || Date.now().toString()) + (gameState.gameSettings?.guessTimeLimit || 5) * 1000 * 60}
                    />
                    <br/>
                    <br/>
                    {getRoleInfo()}
                </div>
            case "FIND_INSIDER":
                return gameState.players?.map(e => <p key={e.name}>{e.name} - {e.accusedPlayer ? e.accusedPlayer : ""}</p>)
            default:
                return <div></div>
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
        <ConfirmGuessedComponent playerId={playerId} open={confirmGuessedOpen} handleClose={getLatestState}/>
        <ConfirmTimeupComponent playerId={playerId} open={confirmTimeupOpen} handleClose={getLatestState}/>
        <CastVoteComponent playerId={playerId} gameState={gameState} open={castVoteOpen} handleClose={getLatestState}/>
        <ConfirmVotingCompleteComponent playerId={playerId}open={confirmCompleteOpen} handleClose={getLatestState}/>
    </div>
}

export default InsiderComponent