const fs = require('fs');
const path = require('path');
const InputDataDecoder = require('ethereum-input-data-decoder');

(async function main() {
	const abiPath = path.join(__dirname, 'artifacts', 'abi.json');
	console.log('abiPath: ', abiPath);
	const decoder = new InputDataDecoder(abiPath);
	const inputData = fs
		.readFileSync('inputdata.txt')
		.toString()
		.trim();
	console.log(decoder);
	console.log(inputData);

	const result = decoder.decodeData(inputData);
	console.log(result);
})();
