const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
require('dotenv').config();
module.exports = (phase, { defaultConfig }) => {
	// console.log(phase);
	// console.log(process.env);
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		return {
			/* development only config options here */
		};
	}

	return {
		/* config options for all phases except development here */
	};
};
