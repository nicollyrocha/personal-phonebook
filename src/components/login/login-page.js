import './login.scss';
import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import api from '../../services/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginPage() {
	const [user, setUser] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(false);
	const [autoCompleteOnOff, setAutoCompleteOnOff] = React.useState('off');
	const [isError, setIsError] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [userId, setUserId] = React.useState('');
	const history = useNavigate();

	useEffect(() => {
		if (window.localStorage.getItem('remember') === 'true') {
			setUser(window.localStorage.getItem('user'));
			setPassword(window.localStorage.getItem('password'));
			setRemember(true);
		} else {
			setUser('');
			setPassword('');
			setRemember(false);
		}
	}, []);

	async function login() {
		try {
			setIsLoading(true);
			const userLogin = await api.post('/api/auth/login', {
				password: password,
				username: user,
			});
			setUserId(userLogin.data.id);
			console.log(userLogin.data);
			isRememberChecked();

			setTimeout(() => {
				setIsLoading(false);
				setIsError(false);
				history('/home', {
					state: {
						data: {
							user: user,
							id: userLogin.data.id,
							token: userLogin.data.accessToken,
							tipo: userLogin.data.tipos[0],
						},
					},
				});
				localStorage.setItem('token', userLogin.data.accessToken);
			}, '2000');
		} catch (e) {
			setIsLoading(false);
			setIsError(true);
			setErrorMsg(e.response.data.error);
		}
	}

	function isRememberChecked() {
		window.localStorage.setItem('remember', remember);
		window.localStorage.setItem('user', user);
		window.localStorage.setItem('password', password);
		if (remember === true) {
			setAutoCompleteOnOff('on');
		} else {
			setAutoCompleteOnOff('off');
		}
	}

	function onChangeUser(e) {
		setUser(e.target.value);
	}

	function onChangePassword(e) {
		setPassword(e.target.value);
	}

	function onChangeRememberUser(checked) {
		setRemember(checked.target.checked);
	}

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div className="main-title">Phonebook</div>

				<div className="login">
					<hr
						style={{
							marginTop: '0px',
							color: '#cf2e2e',
							backgroundColor: '#cf2e2e',
							height: '70vh',
							marginRight: '0',
							marginLeft: '0',
							border: 'none',
							width: '1px',
							boxShadow: '0 0 15px #ff0000, 0 0 5px #cf2e2e',
							display: 'flex',
						}}
					/>
					<Box
						minWidth={400}
						minHeight={400}
						className="box-login"
					>
						<div className="div-geral">
							<div className="div-login">
								{' '}
								<span>Login</span>
							</div>

							<Grid
								item
								xs={8}
								className="fields-login"
							>
								<TextField
									label="E-mail"
									type={'email'}
									variant="standard"
									value={user}
									autoComplete={autoCompleteOnOff}
									onChange={(e) => onChangeUser(e)}
									sx={{
										width: '20vw',
										margin: '1vw',
									}}
								/>
							</Grid>
							<Grid
								item
								xs={8}
								className="fields-login"
							>
								<TextField
									label="Senha"
									variant="standard"
									type={'password'}
									value={password}
									autoComplete={autoCompleteOnOff}
									required
									onChange={(e) => onChangePassword(e)}
									sx={{
										width: '20vw',
										margin: '1vw',
									}}
								/>
							</Grid>
							<div className="buttons">
								<Grid
									item
									xs={8}
									className="fields-login"
								>
									{isLoading === true ? (
										<CircularProgress
											size={22}
											style={{
												marginTop: '1vh',
												marginRight: '1vw',
												marginLeft: '1vw',
												marginBottom: '1vh',
											}}
										/>
									) : (
										<Button
											variant="outlined"
											onClick={login}
											style={{
												marginBottom: '2%',
											}}
										>
											Login
										</Button>
									)}
								</Grid>
								<Grid
									item
									xs={8}
									className="fields-login"
								>
									<Button variant="outlined">Cadastre-se</Button>
								</Grid>
							</div>
							{isError === true ? (
								<Alert
									onClose={() => {
										setIsError(false);
									}}
									style={{ marginTop: '1vh' }}
									severity="error"
								>
									{errorMsg}
								</Alert>
							) : null}
							<FormControlLabel
								control={
									<Checkbox
										checked={remember}
										onChange={(checked) => onChangeRememberUser(checked)}
									/>
								}
								label="Lembre-me"
							/>
						</div>
					</Box>
				</div>
			</div>
		</>
	);
}
