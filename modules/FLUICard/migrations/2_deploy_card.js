const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const AzureUploader = require('@flui/klaytn-uploader').AzureUploader;
const FLUICard = artifacts.require('FLUICard');

module.exports = function(deployer) {
	deployer.deploy(FLUICard).then(() => {
		const data = JSON.stringify({
			contractAddress: FLUICard.address
		});

		const basePath = path.join(process.cwd(), process.env.BASE_PATH, './artifacts');
		if (!fs.existsSync(basePath)) {
			fs.mkdirSync(basePath);
			console.log(`\n    Create Artifacts`);
		}

		fs.writeFileSync(path.join(basePath, 'address.json'), data);
		console.log(`\n    Create file of contract address to json: ${FLUICard.address}`);

		const abi = JSON.stringify(FLUICard._json.abi);
		fs.writeFileSync(path.join(basePath, 'abi.json'), abi);
		console.log(`\n    Create file of abi file to json: ${FLUICard.address}`);

		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
		const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
		const uploader = new AzureUploader(accountName, accessKey);

		const containerName = process.env.AZURE_STORAGE_CONTRACT_CONTAINER_NAME;
		uploader
			.uploadArtifacts(FLUICard._json.contractName, 'artifacts', containerName)
			.then(results => {
				const [abiResult, addressResult] = results;

				const envYaml = {
					CONTRACT_ABI_JSON: decodeURIComponent(abiResult.url.trim()),
					CONTRACT_ADDRESS_JSON: decodeURIComponent(addressResult.url.trim())
				};

				const doc = yaml.safeDump(envYaml, {
					flowLevel: 1,
					noCompatMode: true,
					styles: {
						'!!null': 'canonical' // dump null as ~
					}
					// sortKeys: true // sort object keys
				});

				fs.writeFileSync(path.join(basePath, '.env.contract'), doc.replace(/\: /g, '='));
				console.log(`\n    Create file contract env file to yaml`);
			});
	});
};
