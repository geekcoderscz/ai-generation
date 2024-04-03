import { render } from 'preact'
import { App } from './app.tsx'
import './i18n'
import { Suspense } from 'preact/compat'
import { LinearProgress } from '@mui/material'
import { HashRouter } from 'react-router-dom'

render(
	<Suspense fallback={<LinearProgress indeterminate />}>
		<HashRouter>
			<App />
		</HashRouter>
	</Suspense>,
	document.getElementById('app')!,
)
