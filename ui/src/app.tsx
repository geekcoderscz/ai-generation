import './app.css';
import { lazy, Suspense } from 'preact/compat';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.ts';
import { JSX } from 'preact';
import { AppBar, Box, Button, LinearProgress, Link as MLink, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Router from 'preact-router';
import { useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import AsyncRoute from 'preact-async-route';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));

export function App(): JSX.Element {
	const [id] = useState(uuidv4());
	const [advanced, setAdvanced] = useState(false);

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

					<Button onClick={() => setAdvanced(!advanced)} sx={{ ml: 2 }}>
						{ advanced ? 'Advanced': 'Basic' }
					</Button>
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
				<Suspense path="/" fallback={<LinearProgress indeterminate />}>
					<Home advanced={advanced} path="/" />
				</Suspense>

				<Suspense path="/chat" fallback={<LinearProgress indeterminate />}>
					<AsyncRoute
						path="/chat"
						component={Chat}
						advanced={advanced}
						id={id}
					/>
				</Suspense>
			</Router>
		</Box>
	</ThemeProvider>;
}
