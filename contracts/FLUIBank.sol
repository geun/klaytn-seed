pragma solidity ^0.5.6;

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract FLUIBank is Ownable {
    mapping(address => uint256) private balance;
    bool private bankOpen = true;

    modifier bankOpened() {
        require(isOwner() || bankOpen);
        _;
    }

    function setBankState(bool _bankOpen) external onlyOwner {
        bankOpen = _bankOpen;
    }

    function deposit(uint256 _amount) external payable bankOpened {
        require(msg.value == _amount);
        require(balance[msg.sender] + _amount > balance[msg.sender]);

        balance[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) external bankOpened {
        require(balance[msg.sender] >= _amount);

        balance[msg.sender] -= _amount;
        msg.sender.transfer(_amount);
    }

    function transfer(address _to, uint256 _amount) external bankOpened {
        require(balance[msg.sender] >= _amount);
        require(balance[_to] + _amount > balance[_to]);

        balance[msg.sender] -= _amount;
        balance[_to] += _amount;
    }

    function getBalance(address _user) external view bankOpened returns (uint256) {
        return balance[_user];
    }
}
