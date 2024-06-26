import { Button, CircularProgress, Container, Input, Paper, Typography } from '@mui/material'
import apiClient from '../api'
import { useState } from 'preact/hooks'
import { JSX } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { ProviderI } from '../app.tsx'

interface MessageI {
	msg: string
	owner: 'me' | 'other'
}

export const Chat = (props: { id: string; provider: ProviderI }) => {
	const { id, provider } = props
	const [input, setInput] = useState('')
	const [chat, setChat] = useState<MessageI[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const { t } = useTranslation(['common'])

	const askChat = async (e: JSX.TargetedSubmitEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault()
		try {
			setLoading(true)
			const msg: MessageI = {
				owner: 'me',
				msg: input,
			}
			setChat((chat) => [...chat, msg])
			const { data } = await apiClient.post<{
				response: string
			}>('/chat', { input: input }, { headers: { 'X-Chat-Id': id, 'X-Provider': provider } })
			const msgResponse: MessageI = {
				msg: data.response,
				owner: 'other',
			}
			setChat((chat) => [...chat, msgResponse])
			setLoading(false)
			setInput('')
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container>
			{chat.length > 0 && (
				<Paper sx={{ p: 2 }} elevation={1}>
					{chat.map((i) => (
						<div style={{ display: 'flex', justifyContent: i.owner === 'me' ? 'start' : 'end' }}>
							<Paper style={{ maxWidth: '450px' }} sx={{ p: 1, mb: 2 }} elevation={3}>
								<Typography textAlign={i.owner === 'me' ? 'left' : 'right'} as="p">
									{i.msg}
								</Typography>
							</Paper>
						</div>
					))}
				</Paper>
			)}

			<form onSubmit={askChat}>
				<Input sx={{ mt: 4 }} fullWidth color="primary" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
				<Button type="submit" loading="eager">
					{loading && (
						<>
							<Typography as="span" sx={{ mr: 1 }}>
								{t('common.loading')}
							</Typography>
							<CircularProgress size={15} indeterminate />
						</>
					)}
					{!loading && <Typography>{t('common.submit')}</Typography>}
				</Button>
			</form>
		</Container>
	)
}

export default Chat
