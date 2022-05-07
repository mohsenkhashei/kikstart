import Campaign from '../../Campaign/campaign';

export default function CampaignShow() {
	return (
		<>
			<h1>show page </h1>
		</>
	);
}

export async function getInitialProps(props) {
	const campaign = Campaign(props.query.address);

	const summary = await campaign.methods.getSummary().call();
	console.log(summary);
	return {
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
	};
}
