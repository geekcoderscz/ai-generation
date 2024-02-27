import { useState } from 'preact/hooks';
import { Button, CircularProgress, Container, Input, ThemeProvider, Typography } from '@mui/material';
import './app.css';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.ts';
import apiClient from './api';
import { JSX } from 'preact';

export function App() {
	const [input, setInput] = useState('');
	const [img, setImg] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setImg(null)
		try {
			setLoading(true);
			setError('');
			const { data } = await apiClient.get('/', { params: { query: input }, responseType: 'blob' });
			const imageObjectURL = URL.createObjectURL(data);
			setImg(imageObjectURL);
		} catch (err: unknown) {
			if (err) {
				setError(err.toString());
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container>
				<form onSubmit={(e) => handleSubmit(e)}>
					<Input fullWidth color="primary" value={input} onChange={e => setInput(e.currentTarget.value)} />
					<Button disabled={input === ''} type="submit" loading="eager">
						{loading && <>
							<Typography as="span" sx={{ mr: 1 }}>Načítání</Typography>
							<CircularProgress size={15} indeterminate />
						</>}
						{!loading && <Typography>Generovat</Typography>}
					</Button>
				</form>

				{error && <Typography color="red">{error}</Typography>}

				{img && <img style={{ width: '100%' }} src={img} alt={input} />}
			</Container>
		</ThemeProvider>
	);
}
