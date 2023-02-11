import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export const Betting = () => {

  const [amountOut, setAmountOut] = useState(1.56)
  return (
    <div className='bettingParent'>
        <h2>Place Your Bets</h2>
        <div className='info-1'>
            <TextField id="outlined-basic" label="Enter amount" variant="outlined" />
            <p className='p-bet'>Expected amount out: <span className='span-b'>{amountOut}</span></p>
            <Stack spacing={2} direction="row" className='stack-bet'>
                <Button variant="contained" color="success">Up</Button>
                <Button variant="contained" color="error">Down</Button>
            </Stack>
            <Button variant="contained" color="primary">Submit</Button>
        </div>
    </div>
  )
}
