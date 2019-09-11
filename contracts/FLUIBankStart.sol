pragma solidity ^0.5.6;

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract FLUIBankStart is Ownable {

    function getBankState() public returns(bool state) {
        return false;
    }

    function setBankState(bool state) public {
    }

    function deposit(uint256 amount) public payable {

    }

    function withdraw(uint256 amount) public {

    }

    function transfer(address to, address from, uint256 amount) public {

    }

    function getBalance() public returns (uint balance){
        return 0;
    }

}


