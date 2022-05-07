import React, { useState } from 'react';
import { Button, Input, Form, Message } from 'semantic-ui-react';
import factory from '../../Campaign/factory';
import web3 from '../../Campaign/web3';
import { Router } from '../../routes';

export default function CampaignNew() {
	const [minimumContribution, setMinimumContribution] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setErrorMessage('');
		try {
			const accounts = await web3.eth.getAccounts();
			console.log(minimumContribution);

			await factory.methods.createCampaign(minimumContribution).send(
				{
					from: accounts[0],
				},
				function (err, res) {
					if (err) {
						console.log('An error occured', err);

						return;
					}

					console.log('Hash of the transaction: ' + res);
				}
			);
			Router.pushRoute('/');
		} catch (err) {
			setErrorMessage(err.message);
		}
		setLoading(false);
	};

	return (
		<>
			<h3>Create a Campaign</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						value={minimumContribution}
						onChange={(event) =>
							setMinimumContribution(event.target.value)
						}
					/>
				</Form.Field>
				<Message error header="Oops!" content={errorMessage} />

				<Button color="violet" loading={loading}>
					Create
				</Button>
			</Form>
		</>
	);
}
