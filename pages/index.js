import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Card, Button } from 'semantic-ui-react';

import factory from '../Campaign/factory';
import { Link } from '../routes';
export default class CampaginIndex extends Component {
	renderCampaigns() {
		const items = this.props.campaigns.map((address) => {
			return {
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});
		return <Card.Group items={items} />;
	}
	static getInitialProps = async () => {
		const campaigns = await factory.methods.getDeployedCampaigns().call();

		return { campaigns };
	};
	render() {
		return (
			<>
				<div>
					<h1>campaign index page</h1>
					<Link route="/campaigns/new">
						<a>
							<Button
								color="violet"
								content="Create a Campaign"
								floated="right"
								icon="add circle"
							/>
						</a>
					</Link>
					{this.renderCampaigns()}
				</div>
			</>
		);
	}
}
