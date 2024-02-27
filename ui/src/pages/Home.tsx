import { v4 as uuidv4 } from 'uuid';
import { JSX } from 'preact';
import apiClient from '../api';
import { Button, CircularProgress, Container, Input, Typography } from '@mui/material';
import { useState } from 'preact/hooks';

export const Home = (_: { path: string }) => {
	const [id] = useState(uuidv4());
	const [input, setInput] = useState('');
	const [img, setImg] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [generateLoading, setGenerateLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setImg(null);
		try {
			setLoading(true);
			setError('');
			const { data } = await apiClient.get('/image', {
				params: { query: input },
				headers: { 'X-Chat-Id': id },
				responseType: 'blob'
			});
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

	const handleGenerate = async (): Promise<void> => {
		try {
			setGenerateLoading(true);
			const { data } = await apiClient.post<{
				response: string
			}>('/chat', { input: 'Give me a topic in one simple sentence that could be interesting for AI generated images, it can be weird or sometimes a little unsetelling' }, { headers: { 'X-Chat-Id': id } });
			setGenerateLoading(false);
			setInput(data.response);
		} catch (e) {
			console.error(e);
		} finally {
			setGenerateLoading(false);
		}
	};

	return (
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

				<Button onClick={handleGenerate} type="button" loading="eager">
					<Typography>Doporučit</Typography>
					{generateLoading && <CircularProgress sx={{ ml: 1 }} size={15} indeterminate />}
				</Button>
			</form>

			{error && <Typography color="red">{error}</Typography>}

			{img && <img style={{ width: '100%' }} src={img} alt={input} />}
		</Container>
	);
};
