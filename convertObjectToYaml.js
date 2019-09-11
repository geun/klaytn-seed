const fs = require('fs');
const yaml = require('js-yaml');

const abiUrl = "https://fluius.blob.core.windows.net/fluius-contract-production/artifacts/contracts/FLUIBank/1568192477540/abi.json";
const addressUrl = "https://fluius.blob.core.windows.net/fluius-contract-production/artifacts/contracts/FLUIBank/1568192477540/addressFile.json";

const envYaml = {
	CONTRACT_ABI_JSON: decodeURIComponent(abiUrl),
	CONTRACT_ADDRESS_JSON: decodeURIComponent(addressUrl)
};

const doc = yaml.safeDump(envYaml, {
	flowLevel: 1,
	noCompatMode: true,
	styles: {
		'!!null': 'canonical' // dump null as ~
	},
	// sortKeys: true // sort object keys
});

fs.writeFileSync('./artifacts/.env.contract', doc.replace(/\: /g, '='));
console.log(`\n    Create file contract env file to yaml`);
