import Header from './Header';
import { Container, Divider } from 'semantic-ui-react';

export default function Layout({ children }) {
	return (
		<Container>
			<Header />
			{children}
			<Divider />
		</Container>
	);
}
