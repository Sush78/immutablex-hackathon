const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT_NO = 9000;
const app = express();
const ethers = require("ethers");
require("dotenv").config();
// contact address = 0x0BD807746807De32aC151c1D99ca9e0C7E9Ac402
// get contract ABI
const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_betPeriodEnd",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "betDirection",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      }
    ],
    "name": "NewBet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      }
    ],
    "name": "betPayout",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "Bets",
    "outputs": [
      {
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "bet_direction",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "betCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "betPeriodEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_bettor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_betId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountOut",
        "type": "uint256"
      }
    ],
    "name": "claimBetPayout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_betDirection",
        "type": "uint256"
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recieveFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = `${process.env.POOL_BET_ADDRESS}`;
// set up alchemy node provider
const aProvider = new ethers.JsonRpcProvider(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);
// set up dev wallet (contract owner)
const signingKey = new ethers.SigningKey(`0x${process.env.PRIVATE_KEY}`);
const wallet = new ethers.Wallet(signingKey, aProvider);
// connect to contract
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const baseURL=""

app.get("/place-bet/:id", async (req, res) => {
  const cid = req.path.split("/")[2]
  const url = baseURL+"/create-position/"+cid
  const body = req.body
  const result = await axios.post(url, body);
  res.status(200).json(metaData);
  console.log(req.path);
});

// app.listen(PORT_NO, async (req, res) => {
//   console.log("listenng");
// });
const calculatePayout = (_bet, _totalPoolAmount, _winPoolSize, _losePoolSize) => {
  const betRatio = _bet/_winPoolSize;
  console.log(`betRatio: ${betRatio}`)
  return (_bet + (betRatio*1*_losePoolSize))
};

const payoutBet = async (betResult) => {
  const betCount = await contract.betCount()
  const totalPoolAmount = await contract.getBalance();
  var winPoolMap = new Map(); var losePoolMap = new Map();
  var winPoolSize = 0; var losePoolSize = 0;
  // console.log(`total pool amount: ${totalPoolAmount}`);
  // loop through all bets and get relative pool results and size
  for (let i = 1; i < Number(betCount) +1; i++) {
    let { bettor, bet_direction, amountIn } = await contract.Bets(i);
     // console.log(`For bet ${i}: ${bettor}, ${bet_direction}, ${amountIn}`)
    // If win 
    if (bet_direction == betResult) {
      //append to win map
      winPoolMap.set(i, [bettor,ethers.formatEther(amountIn)]);
      winPoolSize = winPoolSize + Number(ethers.formatEther(amountIn));
    } else {
      losePoolMap.set(i, [bettor,ethers.formatEther(amountIn)]);
      losePoolSize = losePoolSize + Number(ethers.formatEther(amountIn));
    };
  }
  // console.log({winPoolMap}, winPoolSize)
  // console.log({losePoolMap}, losePoolSize)
  // Loop through winners and pay them out
  for (let[betId, value] of winPoolMap){
    const bettor = value[0]; const amountIn = Number(value[1]);
    const amountOut = calculatePayout(amountIn, Number(totalPoolAmount), winPoolSize,losePoolSize);
    console.log(`Bet ${betId} wins ${amountOut}`);
    await contract.claimBetPayout(bettor, betId, amountOut)
  }
};

payoutBet(1);