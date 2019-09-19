const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const AzureUploader = require('@flui/klaytn-uploader').AzureUploader;
const FLUIBank = artifacts.require('FLUIBank');

module.exports = function(deployer) {
	deployer.deploy(FLUIBank).then(() => {
		const data = JSON.stringify({
			contractAddress: FLUIBank.address
		});

		const basePath = path.join(process.cwd(), process.env.BASE_PATH, './artifacts');
		if (!fs.existsSync(basePath)) {
			fs.mkdirSync(basePath);
			console.log(`\n    Create Artifacts`);
		}

		fs.writeFileSync(path.join(basePath, 'address.json'), data);
		console.log(`\n    Create file of contract address to json: ${FLUIBank.address}`);

		const abi = JSON.stringify(FLUIBank._json.abi);
		fs.writeFileSync(path.join(basePath, 'abi.json'), abi);
		console.log(`\n    Create file of abi file to json: ${FLUIBank.address}`);

		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
		const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
		const uploader = new AzureUploader(accountName, accessKey);

		const containerName = process.env.AZURE_STORAGE_CONTRACT_CONTAINER_NAME;
		uploader
			.uploadArtifacts(FLUIBank._json.contractName, 'artifacts', containerName)
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
