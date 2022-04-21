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

function JoinGameComponent(props: Props) {
    const [role, setRole] = useState<'LEADER' | 'INSIDER' | 'COMMON' | "">("");
    const [ready, setReady] = useState<boolean>(true);
    const [errorText, setErrorText] = useState<string>("");

    const handleClose = () => {
        setRole("")
        setReady(true)
        setErrorText("")
        props.handleClose();
    }

    const handleConfirm = () => {
        GameControllerService.ready(props.playerId, ready, role === "" ? undefined : role)
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
        <DialogTitle>Confirm Ready</DialogTitle>
        <DialogContent>
            <FormControlLabel control={<Checkbox onChange={e => setReady(e.target.checked)} defaultChecked/>}
                              label="Ready"/>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={role}
                onChange={e => setRole(e.target.value as 'LEADER' | 'INSIDER' | 'COMMON' | "")}
            >
                <FormControlLabel value="" control={<Radio/>} label="Random"/>
                <FormControlLabel value="LEADER" control={<Radio/>} label="Leader"/>
                {/*<FormControlLabel value="INSIDER" control={<Radio />} label="Insider" />*/}
                {/*<FormControlLabel value="COMMON" control={<Radio />} label="Common" />*/}
            </RadioGroup>
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

export default JoinGameComponent