import { StateUpdater, useState } from 'preact/hooks'
import { Box, Button, Link as MLink, Toolbar, Typography, Menu as MUIMenu } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { ProviderI } from '../app.tsx'
import { Dispatch } from 'preact/compat'
// @ts-expect-error Import from source since there is no other way
import { MouseEventHandler } from 'preact/src/jsx'

const options = ['cloudflare', 'openai'] as const

export const Menu = (props: { provider: ProviderI; setProvider: Dispatch<StateUpdater<ProviderI>> }) => {
	const { provider, setProvider } = props
	const { t } = useTranslation(['navbar'])
	const [anchorEl, setAnchorEl] = useState<null | HTMLAnchorElement>(null)
	const open = Boolean(anchorEl)

	const handleClick = (event: MouseEventHandler<HTMLAnchorElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = (option?: ProviderI) => {
		if (option) {
			setProvider(option)
		}
		setAnchorEl(null)
	}

	return (
		<div>
			<Toolbar>
				<Typography variant="h6" as="div" sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}>
					{t('navbar.title')}
					<>
						<Button
							id="fade-button"
							aria-controls={open ? 'fade-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
							sx={{ ml: 2 }}
						>
							{provider}
						</Button>
						<MUIMenu
							id="fade-menu"
							MenuListProps={{
								'aria-labelledby': 'fade-button',
							}}
							anchorEl={anchorEl}
							open={open}
							onClose={() => handleClose()}
						>
							{options.map((option) => (
								<MenuItem onClick={() => handleClose(option)}>{option}</MenuItem>
							))}
						</MUIMenu>
					</>
				</Typography>
				<Box sx={{ display: { xs: 'block', sm: 'block' } }}>
					<MLink sx={{ mr: 2 }} href="/">
						{t('navbar.menu.images')}
					</MLink>
					<MLink href="/chat">{t('navbar.menu.chat')}</MLink>
				</Box>
			</Toolbar>
		</div>
	)
}

export default Menu
