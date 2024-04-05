import { lazy, useEffect } from 'preact/compat'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.ts'
import { JSX } from 'preact'
import { AppBar, Box, ThemeProvider } from '@mui/material'
import { useState } from 'preact/hooks'
import { v4 as uuidv4 } from 'uuid'
import Menu from './components/Menu.tsx'
import apiClient from './api'
import { GetProvidersResponse } from './interface/ApiResponse.ts'
import { Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Chat = lazy(() => import('./pages/Chat'))

export type ProviderI = 'cloudflare' | 'openai'

export function App(): JSX.Element {
	const [id] = useState(uuidv4())
	const [provider, setProvider] = useState<ProviderI>('cloudflare')
	const [availableProviders, setAvailableProviders] = useState<GetProvidersResponse | undefined>()

	useEffect(() => {
		const fetchProviders = async () => {
			const { data } = await apiClient.get<GetProvidersResponse>('/providers')
			setAvailableProviders(data)
		}

		fetchProviders()
	}, [])

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar>
				<Menu availableProviders={availableProviders} provider={provider} setProvider={setProvider} />
			</AppBar>
			<Box component="main" sx={{ mt: 8 }}>
				<Switch>
					<Route exact path="/">
						<Home provider={provider} />
					</Route>
					<Route path="/chat">
						<Chat id={id} provider={provider} />
					</Route>
				</Switch>
			</Box>
		</ThemeProvider>
	)
}
