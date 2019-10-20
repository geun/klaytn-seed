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

		const basePath = path.join(process.env.BASE_PATH, './artifacts');
		const currentPath = path.join(process.cwd(), basePath);

		if (!fs.existsSync(currentPath)) {
			fs.mkdirSync(currentPath);
			console.log(`\n    Create Artifacts`);
		}

		fs.writeFileSync(path.join(currentPath, './address.json'), data);
		console.log(`\n    Create file of contract address to json: ${FLUIBank.address}`);

		const abi = JSON.stringify(FLUIBank._json.abi);
		fs.writeFileSync(path.join(currentPath, './abi.json'), abi);
		console.log(`\n    Create file of abi file to json: ${FLUIBank.address}`);

		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
		const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
		const uploader = new AzureUploader(accountName, accessKey);

		const containerName = process.env.AZURE_STORAGE_CONTRACT_CONTAINER_NAME;
		uploader
			.uploadArtifacts(FLUIBank._json.contractName, basePath, containerName)
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

				fs.writeFileSync(path.join(currentPath, '.env.contract'), doc.replace(/\: /g, '='));
				console.log(`\n    Create file contract env file to yaml`);
			});
	});
};
