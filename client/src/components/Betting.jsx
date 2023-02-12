import React, {useState, useContext} from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TransactionContext } from "../context/TransactionContext";
import { createNewbet } from '../service/api'

export const Betting = () => {
  const { sendBetTransaction, formData, currentAccount } = useContext(TransactionContext);
  const [amountOut, setAmountOut] = useState(1.56)
  const [direction, setDirection] = useState(0)
  const [disabled, setDisabled] = useState(true)

  const handleChangeNew = (e) => {
    formData['amountIn'] = e.target.value
  }

  const changeDirUp = () => {
    setDirection(1)
    formData['direction'] = 1
    setDisabled(false)
  }

  const changeDirDown = () => {
    setDirection(0)
    formData['direction'] = 0
    setDisabled(false)
  }

  const placeBet = async() => {
    console.log(direction)
    sendBetTransaction()
    const betId = 3
    const body = {"betId": betId, "betDirection": direction, "amountIn": formData['amountIn'], "result": "NA", "amountOut": 0, "userAddress": currentAccount}
    const params = {body, cid: betId}
    const data = await createNewbet(params)
  }
  return (
    <div className='bettingParent'>
        <h2>Place Your Bets</h2>
        <div className='info-1'>
            <TextField id="outlined-basic" label="Enter amount" variant="outlined" name="amountIn" htmlFor="amountIn" onChange={handleChangeNew}/>
            <p className='p-bet'>Expected amount out: <span className='span-b'>{amountOut}</span></p>
            <Stack spacing={2} direction="row" className='stack-bet'>
                <Button variant="contained" color="success" onClick={changeDirUp}>Up</Button>
                <Button variant="contained" color="error" onClick={changeDirDown}>Down</Button>
            </Stack>
            {disabled && <Button variant="contained" color="primary" disabled onClick={placeBet}>Place Bet</Button>}
            {!disabled && <Button variant="contained" color="primary" onClick={placeBet}>Place Bet</Button>}
        </div>
    </div>
  )
}
