// SPDX-License-Identifier: MIT

pragma solidity  ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract bettingPool is Ownable {
  using SafeMath for uint;

  uint public betPeriodEnd;
  // betCount used to generate betId
  uint public betCount;

  struct Bet {
    address  bettor;
    uint bet_direction;
    uint amountIn;
  }
  // Maps a betId to a Bet
  mapping(uint => Bet) public Bets;

  event NewBet(address bettor, uint betDirection, uint amountIn, uint betId);
  event betPayout(address bettor, uint amountOut, uint betId);

  constructor(uint _betPeriodEnd) {
    betCount = 0;
    betPeriodEnd = _betPeriodEnd;
  }

  function getBalance() external view returns(uint) {
    return address(this).balance;    
}
  function recieveFunds () public payable {
      require(msg.value > 0, "Can not send 0 Eth");
  }

  function placeBet(uint _betDirection) external payable {
    require(betPeriodEnd > block.timestamp, "Bets cannot be placed after event has started");
    // increment betCount
    betCount = betCount+1;
    uint betId = betCount;
    // contruct the struct for a new bet
    Bet memory newBet = Bet(msg.sender, _betDirection, msg.value);
    // add the struct to the bet mapping
    Bets[betId] = newBet;
    // add to total pool amount
    emit NewBet(msg.sender, _betDirection, msg.value, betId);
  }

  function claimBetPayout(address payable _bettor, uint _betId, uint _amountOut) external onlyOwner {
    _bettor.transfer(_amountOut);
    emit betPayout(_bettor, _amountOut, _betId);
  }
}