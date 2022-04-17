import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {GameControllerService} from "../generated";

function JoinGameComponent(props: Props) {
    const [playerName, setPlayerName] = useState<string>("");
    const [gameCode, setGameCode] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");

    const handleClose = () => {
        setPlayerName("")
        setGameCode("")
        setErrorText("")
        props.handleClose();
    }

    const handleCreate = () => {
        GameControllerService.joinGame(props.playerId, playerName, gameCode.toUpperCase())
            .then((e) => {
                props.handleClose();
            })
            .catch(e => {
                setErrorText(e.body.message)
            });
    }

    return <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={props.open}
        onClose={handleClose}>
        <DialogTitle>Join Game</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="playerName"
                label="Player Name"
                type="text"
                fullWidth
                variant="standard"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="gameCode"
                label="Game Code"
                type="text"
                fullWidth
                variant="standard"
                value={gameCode}
                onChange={e => setGameCode(e.target.value)}
            />
            {errorText && <DialogContentText style={{color: 'red'}} mt={4}>{errorText}</DialogContentText>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreate}>Join</Button>
        </DialogActions>
    </Dialog>
}

interface Props {
    playerId: string
    open: boolean
    handleClose: () => void
}

export default JoinGameComponent