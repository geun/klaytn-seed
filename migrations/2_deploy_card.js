const fs = require('fs');
const ERC721Card = artifacts.require('ERC721Card');

module.exports = function(deployer) {
	deployer.deploy(ERC721Card).then(() => {
		console.log('ERC721Card', ERC721Card);

		fs.writeFile(
			'./contract.json',
			JSON.stringify({
				blockAddress: ERC721Card.blockAddress,
				contractAddress: ERC721Card.address
			})
		);
	});
};
