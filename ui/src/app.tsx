import './app.css';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.ts';
import { JSX } from 'preact';
import { AppBar, Box, Link as MLink, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Router from 'preact-router';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import AsyncRoute from 'preact-async-route';

export function App(): JSX.Element {
	const [id] = useState(uuidv4());

	return <ThemeProvider theme={theme}>
		<CssBaseline />
		<AppBar>
			<Toolbar>
				<Typography
					variant="h6"
					as="div"
					sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
				>
					AI
				</Typography>
				<Box sx={{ display: { xs: 'block', sm: 'block' } }}>
					<MLink sx={{ mr: 2 }} href="/">
						Domů
					</MLink>
					<MLink href="/chat">
						Chat
					</MLink>
				</Box>
			</Toolbar>
		</AppBar>
		<Box component="main" sx={{ mt: 8 }}>
			<Router>
				<Home path="/" />
				<AsyncRoute
					path="/chat"
					component={Chat}
					id={id}
				/>
			</Router>
		</Box>
	</ThemeProvider>;
}
