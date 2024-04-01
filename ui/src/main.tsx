import { render } from 'preact';
import { App } from './app.tsx';
import './i18n';
import { Suspense } from 'preact/compat';
import { LinearProgress } from '@mui/material';

render(<Suspense fallback={<LinearProgress indeterminate />}>
	<App />
</Suspense>, document.getElementById('app')!);
