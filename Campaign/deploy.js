require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
	process.env.APP_METAMASK_CODE,
	process.env.APP_INFURA_ROPSTEN_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
	try {
		const accounts = await web3.eth.getAccounts();
		console.log(accounts);

		console.log('Attempting to deploy from account', accounts[1]);

		const result = await new web3.eth.Contract(compiledFactory.abi)
			.deploy({ data: compiledFactory.evm.bytecode.object })
			.send({ gas: '5000000', from: accounts[1] });

		console.log('Contract deployed to', result.options.address);
		provider.engine.stop();
	} catch (err) {
		console.log(err);
	}
};
deploy();
