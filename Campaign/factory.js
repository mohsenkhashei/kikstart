import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	CampaignFactory.abi,

	'0x494d41cAC64D747CA7e507815a03a7D1771D0ca3'
);

export default instance;
