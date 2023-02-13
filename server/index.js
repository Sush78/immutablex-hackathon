const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT_NO = 9001;
const app = express();
const ethers = require("ethers");
require("dotenv").config();
const axios = require('axios')

const alchemyprovider = require('@ethersproject/providers');
const wallet2 = require('@ethersproject/wallet');
const imtbl = require('@imtbl/core-sdk');
const keccak = require('@ethersproject/keccak256');
const etherStrings = require('@ethersproject/strings');
const BN = require('bn.js'); 
const encUtils = require('enc-utils');

const config = imtbl.Config.SANDBOX; // Or Config.PRODUCTION
const client = new imtbl.ImmutableX(config);

// Create Ethereum signer
const ethNetwork = 'goerli'; // Or 'mainnet'
const provider = new alchemyprovider.AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
const ethSigner = new wallet2.Wallet(process.env.PRIVATE_KEY).connect(provider);

// Create Stark signer

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

const apiAddress = 'https://api.x.immutable.com/v1';

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
const baseURL="http://ec2-3-8-208-18.eu-west-2.compute.amazonaws.com"


mintTokenUrl = "https://api.sandbox.x.immutable.com/v2/mints"
const object = {
    contract_address: "0xA146505AE6DCB1CDdFb15552AEE8f466586a6b95",
    users: [
      {
        ether_key: process.env.PRIVATE_KEY,
        tokens: [
          {
            id: "6",
            blueprint: "string",
          }
        ]
      }
    ],
  };

const message = keccak.keccak256(etherStrings.toUtf8Bytes(JSON.stringify(object)));  

async function signRaw(
    message,
    signer,
  ){
    const signature = deserializeSignature(await signer.signMessage(message));
    return serializeEthSignature(signature);
  }

  function importRecoveryParam(v) {
    return v.trim()
      ? new BN(v, 16).cmp(new BN(27)) !== -1
        ? new BN(v, 16).sub(new BN(27)).toNumber()
        : new BN(v, 16).toNumber()
      : undefined;
  }
  
  function deserializeSignature(sig, size = 64) {
    sig = encUtils.removeHexPrefix(sig);
    return {
      r: new BN(sig.substring(0, size), 'hex'),
      s: new BN(sig.substring(size, size * 2), 'hex'),
      recoveryParam: importRecoveryParam(sig.substring(size * 2, size * 2 + 2)),
    };
  }

  function serializeEthSignature(sig) {
    // This is because golang appends a recovery param
    // https://github.com/ethers-io/ethers.js/issues/823
    return encUtils.addHexPrefix(
      encUtils.padLeft(sig.r.toString(16), 64) +
        encUtils.padLeft(sig.s.toString(16), 64) +
        encUtils.padLeft(sig.recoveryParam?.toString(16) || '', 2),
    );
  }

app.post("/place-bet/:id", async (req, res) => {
  const cid = req.path.split("/")[2]
  const url = baseURL+"/create-position/"+cid
  const userAddress = req.body.userAddress
  console.log(userAddress)
  const body = req.body
  delete body.userAddress
  const result = await axios.post(url, body);
  const body2 = {
    contract_address: "0xA146505AE6DCB1CDdFb15552AEE8f466586a6b95",
    users: [
      {
        user: "0x4F8d449ac145779b566855D02C9A37c4e96153c6",
        tokens: [
          {
            // Specific NFT token
            id: req.body.betId.toString(),
            blueprint: "my-on-chain-metadata",
          }
        ]
      }
    ]
  }
  const starkPrivateKey = await imtbl.generateLegacyStarkPrivateKey(ethSigner);
  const starkSigner = imtbl.createStarkSigner(starkPrivateKey);

  const walletConnection = { ethSigner, starkSigner }
  client.registerOffchain(walletConnection)
  const mintResponse = await client.mint(ethSigner, body2);
  console.log(mintResponse)
  res.status(201).json({"message": "Success"});
  console.log(req.path);
});

app.listen(PORT_NO, async (req, res) => {
  console.log("listenng");
//   const sign = await signRaw(message, ethSigner)
//   console.log(sign)
  setTimeout(testfunc,1000 * 5 * 60)
});

const testfunc = async () => {
    console.log("Betting Period Over; Lets see the results!");
    const bettedPrice = 1700;
    const result = await apiResult(bettedPrice)
    // call pay
    await payoutBet(result.result);
  };
  
  const apiResult = async (_target) => {
    const request = await axios.get("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=HRAQIIHSR94XF7RRSTXQES91P3I9RSBIES")
    const priceResult = Number(request.data.result.ethusd)
    let betResult;
    if (priceResult >= _target){
      betResult = 1 // target price is met
    } else {
      betResult = 0
    };
    return {resultPrice: priceResult,
      result: 1
    };
  }
  
  const calculatePayout = (_bet, _totalPoolAmount, _winPoolSize, _losePoolSize) => {
    const betRatio = _bet/_winPoolSize;
    return (_bet + (betRatio*1*_losePoolSize))
  };
  
const updateMetadataResult = async (_betId, _bet_direction, _amountIn, _result, _payAmount) => {
    const betResult = _bet_direction==_result ? "win" : "loss"
    const UpdatedMetaData = {
      "betId": _betId,
      "betDirection": _bet_direction,
      "amountIn": _amountIn,
      "result": betResult,
      "amountOut": Number(_payAmount)
    };
    console.log(UpdatedMetaData)
    const url = `${baseURL}/update/${_betId}`;
    await axios.post(url, UpdatedMetaData);
}
  
  const payoutBet = async (_betResult) => {
    const betCount = await contract.betCount()
    const totalPoolAmount = ethers.formatEther(await contract.getBalance());
    var winPoolMap = new Map(); var losePoolMap = new Map();
    var winPoolSize = 0; var losePoolSize = 0;
    console.log(`total pool amount: ${totalPoolAmount}`);
    // loop through all bets and get relative pool results and size
    for (let i = 1; i < Number(betCount) +1; i++) {
      let { bettor, bet_direction, amountIn } = await contract.Bets(i);
       // console.log(`For bet ${i}: ${bettor}, ${bet_direction}, ${amountIn}`)
      // If win 
      if (bet_direction == _betResult) {
        //append to win map
        winPoolMap.set(i, [bettor, Number(ethers.formatEther(amountIn)), Number(bet_direction)]);
        winPoolSize = winPoolSize + Number(ethers.formatEther(amountIn));
      } else {
        losePoolMap.set(i, [bettor, Number(ethers.formatEther(amountIn)),Number(bet_direction)]);
        losePoolSize = losePoolSize + Number(ethers.formatEther(amountIn));
      };
    }
    // console.log({winPoolMap}, winPoolSize)
    // console.log({losePoolMap}, losePoolSize)
    var allBetsMap = new Map([...winPoolMap,...losePoolMap])
    // Loop through all bets
    for (let[betId, value] of allBetsMap){
      const bettor = value[0]; const amountIn = value[1]; const bet_direction = value[2];
      // if the bet has won, then payout
      let amountSend;
      if (bet_direction == _betResult) {
        const amountOut = calculatePayout(amountIn, Number(totalPoolAmount), winPoolSize,losePoolSize);
        amountSend = ethers.parseEther(amountOut.toString());
        await contract.claimBetPayout(bettor,betId,amountSend)
        console.log(`${bettor} with bet Id: ${betId} has won ${amountSend} WEI!!`)
      } else {
        amountSend = 0;
      }
      console.log(`UPDATING META DATA FOR BET:${betId}`);
      await updateMetadataResult(betId, bet_direction, amountIn, _betResult, amountSend);
    }
  };