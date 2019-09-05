pragma solidity ^0.5.6;

import '@openzeppelin/contracts/token/ERC721/ERC721Full.sol';

contract ERC721Card is ERC721 {
	struct Card {
		string name; // Name of the Card
		uint256 level; // Level of the Card
	}

	Card[] public cards; // First Item has Index 0
	address public owner;

	constructor() public {
		owner = msg.sender; // owner of MyERC721Card contract who can create a new card
	}

	function mintCard(string memory name, address account) public {
		require(owner == msg.sender); // Only the Owner can create Items
		uint256 cardId = cards.length; // Unique card ID
		cards.push(Card(name, 1));
		_mint(account, cardId); // Mint a new card
	}

	function getCardCount() public view returns(uint count) {
		return cards.length;
	}
}
