const fs = require('fs');
const ERC721Card = artifacts.require('ERC721Card');

module.exports = function(deployer) {
	deployer.deploy(ERC721Card).then(() => {
		const data = JSON.stringify({
			contractAddress: ERC721Card.address
		});
		fs.writeFile('./contract.json', data, () =>
			console.log(`\n    Create file of contract address to json: ${ERC721Card.address}`)
		);

		const abi = JSON.stringify(ERC721Card._json.abi);
		fs.writeFile('./abi.json', abi, () =>
			console.log(`\n    Create file of abi file to json: ${ERC721Card.address}`)
		);
	});
};
