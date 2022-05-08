import Campaign from '../../Campaign/campaign';
import { Card } from 'semantic-ui-react';
import web3 from '../../Campaign/web3';

export default function CampaignShow({ data }) {
	return (
		<>
			<h1>show page </h1>
			{renderCards({ ...data })}
		</>
	);
}

export async function getServerSideProps(context) {
	const campaign = Campaign(context.query.address);
	const summary = await campaign.methods.getSummary().call();
	const data = {
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
		campaignAddress: context.query.address,
	};
	console.log(data);
	return {
		props: {
			data: { ...data },
		},
	};
}

export function renderCards({
	manager,
	minimumContribution,
	requestsCount,
	approversCount,
	balance,
	campaignAddress,
}) {
	const items = [
		{
			header: manager,
			meta: 'Address of the manager',
			description:
				'The manager created this campaign and can create requests to widthdraw money',
			style: { overflowWrap: 'break-word' },
		},
		{
			header: minimumContribution,
			meta: 'Minimum Contribution (wei)',
			description:
				'You must contribute at least this much wei to become an approver',
		},
		{
			header: requestsCount,
			meta: 'Number of Requests',
			description:
				'A request tries to withdraw money from the contract. Request must be approved by approvers',
		},
		{
			header: approversCount,
			meta: 'Number of Approvers',
			description:
				'Number of people who have already donated to this campaign',
		},
		{
			header: web3.utils.fromWei(balance, 'ether'),
			meta: 'Campaign Balance (ether)',
			description:
				'The balance is how much money this campaign has left to spend',
		},
		{
			header: campaignAddress,
			meta: 'Campaign Address',
			description:
				'The address of this campaign. You can send requests to this address',
			style: { overflowWrap: 'break-word' },
		},
	];
	return <Card.Group items={items} />;
}
