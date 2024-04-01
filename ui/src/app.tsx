import './app.css'
import { lazy, Suspense } from 'preact/compat'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.ts'
import { JSX } from 'preact'
import { AppBar, Box, LinearProgress, ThemeProvider } from '@mui/material'
import Router from 'preact-router'
import { useState } from 'preact/hooks'
import { v4 as uuidv4 } from 'uuid'
import AsyncRoute from 'preact-async-route'
import Menu from './components/Menu.tsx'

const Home = lazy(() => import('./pages/Home'))
const Chat = lazy(() => import('./pages/Chat'))

export type ProviderI = 'cloudflare' | 'openai'

export function App(): JSX.Element {
	const [id] = useState(uuidv4())
	const [provider, setProvider] = useState<ProviderI>('cloudflare')

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar>
				<Menu provider={provider} setProvider={setProvider} />
			</AppBar>
			<Box component="main" sx={{ mt: 8 }}>
				<Router>
					<Suspense path="/" fallback={<LinearProgress indeterminate />}>
						<Home provider={provider} path="/" />
					</Suspense>

					<Suspense path="/chat" fallback={<LinearProgress indeterminate />}>
						<AsyncRoute path="/chat" component={Chat} provider={provider} id={id} />
					</Suspense>
				</Router>
			</Box>
		</ThemeProvider>
	)
}
