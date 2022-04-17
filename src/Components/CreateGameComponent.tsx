import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {GameControllerService} from "../generated";
import DialogContentText from "@mui/material/DialogContentText";

function CreateGameComponent(props: Props) {
    const [playerName, setPlayerName] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");

    const handleClose = () => {
        setPlayerName("")
        setErrorText("")
        props.handleClose?.call(null)
    }

    const handleCreate = () => {
        GameControllerService.createGame(props.playerId, playerName)
            .then(e => {
                props.handleClose?.call(null)
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
        <DialogTitle>Create New Game</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Player Name"
                type="text"
                fullWidth
                variant="standard"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
            />
            {errorText && <DialogContentText style={{color: 'red'}} mt={4}>{errorText}</DialogContentText>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
    </Dialog>
}

interface Props {
    playerId: string
    open: boolean
    handleClose?: () => void
}

export default CreateGameComponent