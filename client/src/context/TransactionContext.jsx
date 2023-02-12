import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [formData, setformData] = useState({ amountIn: "", direction: 0});
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [upPool, setUpPool] = useState([]);
  const [downPool, setDownPool] = useState([]);

  const getAllBets = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const allBets = Number(await transactionsContract.betCount());
        if(!allBets) return
        let upPool = 0
        let downPool = 0
        let count = 0
        for(let i=1; i<allBets+1; i++){
            let bet = await transactionsContract.Bets(i)
            bet['bet_direction']==1 ? upPool += 1 : downPool += 1
            count += 1
        }
        setUpPool(upPool)
        setDownPool(downPool)
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try{
        if(!ethereum) return alert("Please install metamask")
        const accounts = await ethereum.request({ method: "eth_accounts"})
        if(accounts.length){
            setCurrentAccount(accounts[0])
            getAllBets()
        }
    } catch(error){
        console.log(error)
        alert("No ethereum object")
    }
  };


  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendBetTransaction = async () => {
    try {
      if (ethereum) {
        console.log("called function: ")
        console.log({formData})
        const { amountIn, direction } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amountIn);

        const transactionHash = await transactionsContract.placeBet(direction, {value: parsedAmount});

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        sendBetTransaction,
        upPool,
        downPool,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};