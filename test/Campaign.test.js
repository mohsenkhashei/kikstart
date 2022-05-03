const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

const compiledFactory = require('../Campaign/build/CampaignFactory.json');
const compiledCampaign = require('../Campaign/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	// console.log(accounts);
	factory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0], gas: '5000000' });

	//create campaign
	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '5000000',
	});

	//get the address of the campaign
	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();

	campaign = await new web3.eth.Contract(
		compiledCampaign.abi,
		campaignAddress
	);
});

describe('Campaigns', () => {
	it('deployes a factory and a campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods
			.contribute()
			.send({ value: '200', from: accounts[1] });
		// check account[1] is approvers or not
		const isContributer = await campaign.methods
			.approvers(accounts[1])
			.call();
		assert(isContributer);
	});

	it('requires a minimum contribution', async () => {
		try {
			await campaign.methods
				.contribute()
				.send({ value: '5', from: accounts[1] });
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	it('allows a manager to make a payment request', async () => {
		await campaign.methods
			.createRequest('Buy batteries', '100', accounts[1])
			.send({
				from: accounts[0],
				gas: '500000',
			});

		const request = await campaign.methods.requests(0).call();

		assert.equal('Buy batteries', request.description);
		assert.equal('100', request.value);
	});

	it('processes requests', async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether'),
		});

		await campaign.methods
			.createRequest('A', web3.utils.toWei('1', 'ether'), accounts[1])
			.send({ from: accounts[0], gas: '500000' });

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '500000',
		});

		//only manager be able to finalize request
		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '500000',
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, 'ether');
		balance = parseFloat(balance);
		console.log(balance);
		// in case test 
		assert(balance > 104);
	});
});
