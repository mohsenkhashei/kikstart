const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//delete the build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//get the contract source code
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
//read the contract source code
const source = fs.readFileSync(campaignPath, 'utf8');

//create input for compile
var input = {
	language: 'Solidity',
	sources: {
		'Campaign.sol': {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};

//compile the contract source code
var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
	'Campaign.sol'
];

//check the directory exist if not create it
fs.ensureDirSync(buildPath);

for (let contract in output) {
    //generate each output file in JSON format
	fs.outputJsonSync(
		path.resolve(buildPath, contract + '.json'),
        //with this object 
		output[contract]
	);
}
