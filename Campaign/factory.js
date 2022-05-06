import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	CampaignFactory.abi,
	'0xE7c28835D19AB5Aa584e95a0782fBE3594166229'
);

export default instance;
