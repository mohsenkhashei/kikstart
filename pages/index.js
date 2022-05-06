import React, { Component, useEffect } from 'react';

import factory from '../Campaign/factory';

function CampaginIndex({ campaigns }) {
	// useEffect(() => {
	// 	const init = async () => {
	// 		console.log(campaigns);
	// 	};
	// 	init();
	// }, []);

	return (
		<>
			<h1>campaign index page</h1>
			<div>{campaigns}</div>
		</>
	);
}

CampaginIndex.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();

	return { campaigns };
};
export default CampaginIndex;
