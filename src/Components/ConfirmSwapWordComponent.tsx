import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {GameControllerService} from "../generated";
import {FormControlLabel, Checkbox, RadioGroup, Radio} from "@mui/material";

function ConfirmSwapWordComponent(props: Props) {
    const [errorText, setErrorText] = useState<string>("");

    const handleClose = () => {
        setErrorText("")
        props.handleClose();
    }

    const handleConfirm = () => {
        GameControllerService.exchangeWord(props.playerId)
            .then((e) => {
                handleClose();
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
        <DialogTitle>Swap Word</DialogTitle>
        <DialogContent>
            <DialogContentText mt={4}>Are you sure you want to exchange this word?</DialogContentText>
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
    open: boolean
    handleClose: () => void
}

export default ConfirmSwapWordComponent