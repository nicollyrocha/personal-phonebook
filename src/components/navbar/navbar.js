import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BookIcon from '@mui/icons-material/Book';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function NavBar({ dados }) {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const location = useLocation();
	const history = useNavigate();
	const pages =
		location.state.data.tipo === 'ROLE_ADMIN'
			? ['Home', 'Meu Cadastro', 'Usuários', 'Pessoas', 'Contatos', 'Logout']
			: ['Home', 'Meu Cadastro', , 'Pessoas', 'Contatos', 'Logout'];
	const settings = ['Logout'];

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
		history('/');
	};
	console.log(dados);

	function onClickPage(page) {
		console.log(page);
		if (page.target.textContent === 'Meu Cadastro') {
			history('/meu-cadastro', {
				state: {
					data: {
						user: location.state.data.user,
						token: window.localStorage.getItem('token'),
						tipo: location.state.data.tipo,
						id: location.state.data.id,
					},
				},
			});
		} else if (page.target.textContent === 'Usuários') {
			history('/usuarios', {
				state: {
					data: {
						user: location.state.data.user,
						token: window.localStorage.getItem('token'),
						tipo: location.state.data.tipo,
						id: location.state.data.id,
					},
				},
			});
		} else {
			history(`/${page.target.textContent}`, {
				state: {
					data: {
						user: location.state.data.user,
						token: window.localStorage.getItem('token'),
						tipo: location.state.data.tipo,
						id: location.state.data.id,
					},
				},
			});
		}
	}

	return (
		<AppBar
			position="static"
			style={{ backgroundColor: '#eccccc', color: '#CF2E2E' }}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<BookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="a"
						onClick={() =>
							history('/home', {
								state: {
									data: {
										user: location.state.data.user,
										token: window.localStorage.getItem('token'),
										tipo: location.state.data.tipo,
										id: location.state.data.id,
									},
								},
							})
						}
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						PHONEBOOK
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
							style={{ color: '#CF2E2E' }}
						>
							{pages.map((page) => (
								<MenuItem key={page} onClick={(page) => onClickPage(page)}>
									<Typography textAlign="center" style={{ color: '#CF2E2E' }}>
										{page}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<BookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						onClick={() =>
							history('/usuarios', {
								state: {
									data: {
										user: location.state.data.user,
										token: window.localStorage.getItem('token'),
										tipo: location.state.data.tipo,
										id: location.state.data.id,
									},
								},
							})
						}
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						PHONEBOOK
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page}
								onClick={(page) => onClickPage(page)}
								sx={{ my: 2, display: 'block' }}
								style={{ color: '#CF2E2E' }}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar>{location.state.data.user[0].toUpperCase()}</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
