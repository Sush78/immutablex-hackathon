import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { TransactionContext } from "../context/TransactionContext";

export const Header = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            XSomething
          </Typography>
          {!currentAccount && <Button color="inherit" onClick={connectWallet}>Connect Wallet</Button>}
          {currentAccount && <p>{currentAccount}</p>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
