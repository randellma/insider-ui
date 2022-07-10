import React, {useState} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {GameControllerService, GameStateDto} from "../generated";
import {FormControlLabel, Checkbox, RadioGroup, Radio} from "@mui/material";

function CastVoteComponent(props: Props) {
    const [accused, setAccused] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");

    const handleClose = () => {
        setAccused("")
        setErrorText("")
        props.handleClose();
    }

    const handleConfirm = () => {
        GameControllerService.votePlayer(props.playerId, accused)
            .then((e) => {
                handleClose();
            })
            .catch(e => {
                setErrorText(e.body.message)
            });
    }

    function getVoteOptions() {
        return <RadioGroup
            row={false}
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={accused}
            onChange={e => setAccused(e.target.value)}
        >
            {props.gameState.players?.filter(player => player.id !== props.playerId).map(player =>
                <FormControlLabel key={player.id} value={player.id} control={<Radio/>} label={player.name}/>)}
        </RadioGroup>
    }

    return <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={props.open}
        onClose={handleClose}>
        <DialogTitle>Who is the insider?</DialogTitle>
        <DialogContent>
            {getVoteOptions()}
            {errorText && <DialogContentText style={{color: 'red'}} mt={4}>{errorText}</DialogContentText>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
    </Dialog>
}

interface Props {
    playerId: string
    gameState: GameStateDto
    open: boolean
    handleClose: () => void
}

export default CastVoteComponent