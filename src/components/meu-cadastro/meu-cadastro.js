import * as React from 'react';
import NavBar from '../navbar/navbar';
import { useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './meu-cadastro.scss';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function MeuCadastro() {
	const location = useLocation();
	const [cpf, setCpf] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [number, setNumber] = React.useState('');
	const [user, setUser] = React.useState('');
	const [name, setName] = React.useState('');
	const [date, setDate] = React.useState('');
	const [errorMsg, setErrorMsg] = React.useState({
		email: '',
		password: '',
		number: '',
		cpf: '',
	});
	const [error, setError] = React.useState({
		email: false,
		password: false,
		number: false,
		cpf: false,
	});
	const [initialData, setInitialData] = React.useState({
		cpf: '',
		email: '',
		name: '',
		password: '',
		number: '',
		user: '',
		id: '',
	});
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');

	useEffect(() => {
		searchUserData();
	}, []);

	async function searchUserData() {
		try {
			const userData = await api.get(
				`/api/usuario/buscar/${location.state.data.id}`
			);
			console.log('a', userData.data.object.usuario.username);
			setInitialData({
				...initialData,
				cpf: userData.data.object.usuario.cpf,
				email: userData.data.object.usuario.email,
				name: userData.data.object.usuario.nome,
				password: userData.data.object.usuario.password,
				number: userData.data.object.usuario.telefone,
				user: userData.data.object.usuario.username,
				id: userData.data.object.usuario.id,
				dataNascimento: userData.data.object.usuario.dataNascimento,
			});
		} catch (e) {
			console.log(e);
		}
	}

	function onChangeDate(newValue) {
		const dataCompleta = new Date(newValue);
		const ano = dataCompleta.getFullYear();
		let dia = dataCompleta.getDate();
		let mes = dataCompleta.getMonth() + 1;

		if (dia < 10) {
			dia = `0${dia}`;
		}

		if (mes < 10) {
			mes = `0${mes}`;
		}

		const dataFormatada = `${ano}-${mes}-${dia}`;
		setDate(dataFormatada);
	}

	function onChangeCpf(e) {
		setCpf(
			e.target.value
				.replace(/\D/g, '')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1')
		);
	}

	function onBlurCpf(e) {
		console.log(/^\d{3}\x2E\d{3}\x2E\d{3}\x2D\d{2}$/.test(cpf));
		if (
			cpf.length > 0 &&
			/^\d{3}\x2E\d{3}\x2E\d{3}\x2D\d{2}$/.test(cpf) === false
		) {
			setError({ ...error, cpf: true });
			setErrorMsg({ ...errorMsg, cpf: 'Insira um CPF válido.' });
		} else if (
			cpf.length === 0 ||
			/^\d{3}\x2E\d{3}\x2E\d{3}\x2D\d{2}$/.test(cpf) === true
		) {
			setError({ ...error, cpf: false });
			setErrorMsg({ ...errorMsg, cpf: '' });
		}
	}

	function onChangeEmail(e) {
		setEmail(e.target.value);
	}

	function onBlurEmail(e) {
		console.log(email);
		const emailValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
		if (email.length === 0 || emailValid === true) {
			setEmail(email);

			setError({ ...error, email: false });
			setErrorMsg({ ...errorMsg, email: '' });
		} else {
			setError({ ...error, email: true });
			setErrorMsg({ ...errorMsg, email: 'Insira um e-mail válido.' });
		}
	}

	function onChangePassword(e) {
		console.log('aaa', e.target.value.length);
		setPassword(e.target.value);
		if (e.target.value.length < 8) {
			setError({ ...error, password: true });
			setErrorMsg({ ...errorMsg, password: 'Número mínimo de caracteres: 8.' });
		} else if (e.target.value.length >= 8 || e.target.value.length === '') {
			setPassword(e.target.value);
			setError({ ...error, password: false });
			setErrorMsg({
				...errorMsg,
				password: '',
			});
		}
	}

	function onBlurPassword(e) {
		if (password.length > 1 && password.length < 8) {
			setError({ ...error, password: true });
			setErrorMsg({ ...errorMsg, password: 'Número mínimo de caracteres: 8.' });
		} else if (password.length >= 8 || password === '') {
			setError({ ...error, password: false });
			setErrorMsg({
				...errorMsg,
				password: '',
			});
		}
	}

	function onChangeNumber(e) {
		console.log('a', e.target.value.length);
		setNumber(
			e.target.value
				.replace(/\D/g, '')
				.replace(/(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{4,5})(\d{4})/, '$1-$2')
		);
	}

	function onBlurNumber(e) {
		if (
			number.length > 0 &&
			/^\(\d{2}\) \d{4,5}-\d{4}$/gi.test(number) === false
		) {
			setError({ ...error, number: true });
			setErrorMsg({
				...errorMsg,
				number: 'Insira um número válido.',
			});
		} else if (
			number.length === 0 ||
			/^\(\d{2}\) \d{4,5}-\d{4}$/gi.test(number) === true
		) {
			setError({ ...error, number: false });
			setErrorMsg({
				...errorMsg,
				number: '',
			});
		}
	}

	function onChangeUser(e) {
		setUser(e.target.value);
	}

	function onChangeName(e) {
		setName(e.target.value);
	}

	async function updateData() {
		console.log(user === '');
		const dados = {
			cpf: cpf === '' ? initialData.cpf : cpf,
			dataNascimento: date === '' ? initialData.dataNascimento : date,
			email: email === '' ? initialData.email : email,
			id: location.state.data.id,
			nome: name === '' ? initialData.name : name,
			password: password === '' ? initialData.password : password,
			telefone: number === '' ? initialData.number : number,
			username: user === '' ? initialData.user : user,
		};
		console.log('abc', dados);
		if (
			cpf === '' &&
			date === '' &&
			email === '' &&
			name === '' &&
			password === '' &&
			number === '' &&
			user === ''
		) {
			console.log('preencha pelo menos 1 campo');
		} else {
			console.log('alowww', error);
			if (
				error.email === false &&
				error.password === false &&
				error.number === false &&
				error.cpf === false
			) {
				try {
					setIsLoading(true);
					await api.put(`/api/usuario/atualizar`, {
						cpf: cpf === '' ? initialData.cpf : cpf,
						dataNascimento: date === '' ? initialData.dataNascimento : date,
						email: email === '' ? initialData.email : email,
						id: location.state.data.id,
						nome: name === '' ? initialData.name : name,
						password: password === '' ? initialData.password : password,
						telefone: number === '' ? initialData.number : number,
						username: user === '' ? initialData.user : user,
					});
					setTimeout(() => {
						setIsLoading(false);
						setCpf('');
						setDate('');
						setEmail('');
						setName('');
						setPassword('');
						setNumber('');
						setUser('');
						setMsg('Cadastro alterado com sucesso!');
						setShowMsg(true);
						setSeverity('success');
					}, '2000');
				} catch (e) {
					console.log(e);
					setMsg(e.response.data.error);
					setShowMsg(true);
					setSeverity('error');
				}
			}
		}
	}

	return (
		<>
			<div>
				<NavBar />
			</div>
			<hr
				style={{
					marginTop: '5vh',
					color: '#e7b7b7',
					backgroundColor: '#e7b7b7',
					border: 'none',
					height: '1px',
				}}
			/>
			{showMsg === true ? (
				<>
					<Snackbar
						open={showMsg}
						autoHideDuration={6000}
						onClose={() => setShowMsg(false)}
					>
						<Alert severity={severity}>{msg !== '' ? msg : ''}</Alert>
					</Snackbar>
				</>
			) : null}
			<div className="form-control-cadastro">
				<div
					className="title-edit"
					style={{ opacity: '1' }}
				>
					Editar Informações
				</div>
				<div className="fields">
					<div>
						<TextField
							onChange={(e) => onChangeCpf(e)}
							value={cpf}
							label="CPF"
							variant="outlined"
							onBlur={() => onBlurCpf()}
							helperText={errorMsg.cpf}
							error={error.cpf}
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
						<TextField
							type={'email'}
							onChange={(e) => onChangeEmail(e)}
							onBlur={(e) => onBlurEmail(e)}
							value={email}
							label="E-mail"
							variant="outlined"
							helperText={errorMsg.email}
							error={error.email}
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
						<TextField
							onChange={(e) => onChangeName(e)}
							value={name}
							label="Nome"
							variant="outlined"
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
					</div>
					<div>
						<TextField
							type={'password'}
							onChange={(e) => onChangePassword(e)}
							label="Senha"
							variant="outlined"
							value={password}
							helperText={errorMsg.password}
							error={error.password}
							onBlur={() => onBlurPassword()}
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
						<TextField
							inputProps={{ maxLength: '15' }}
							onChange={(e) => onChangeNumber(e)}
							label="Telefone"
							variant="outlined"
							value={number}
							helperText={errorMsg.number}
							error={error.number}
							onBlur={() => onBlurNumber()}
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
						<TextField
							label="Usuário"
							variant="outlined"
							onChange={(e) => onChangeUser(e)}
							value={user}
							style={{
								opacity: '1',
								backgroundColor: 'white',
								margin: 10,
								width: '20vw',
							}}
						/>
					</div>
				</div>
				<LocalizationProvider
					dateAdapter={AdapterDayjs}
					style={{
						opacity: '1',
						backgroundColor: 'white',
						margin: 10,
						width: '20vw',
					}}
				>
					<Stack
						spacing={3}
						style={{
							display: 'flex',
							width: '40%',
							margin: '10px',
						}}
					>
						<DatePicker
							label="Custom input"
							value={date}
							onChange={(newValue) => onChangeDate(newValue)}
							maxDate={new Date()}
							renderInput={({ inputRef, inputProps, InputProps }) => (
								<>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignSelf: 'center',
										}}
									>
										<Typography
											variant="span"
											component="span"
											style={{
												marginBottom: '5px',
											}}
										>
											Data Nascimento
										</Typography>

										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<input
												ref={inputRef}
												disabled
												value={date}
												style={{
													textAlign: 'center',
													width: '20vw',
													height: '4vh',
													fontSize: '16px',
												}}
											/>
											{InputProps?.endAdornment}
										</Box>
									</div>
								</>
							)}
						/>
					</Stack>
				</LocalizationProvider>
				<div className="button-save">
					{isLoading === true ? (
						<CircularProgress
							size={22}
							style={{
								marginTop: '1vh',
								marginRight: '1vw',
								marginLeft: '1vw',
							}}
						/>
					) : (
						<Button
							onClick={() => updateData()}
							variant="outlined"
							style={{ opacity: '1', backgroundColor: 'white' }}
						>
							Salvar
						</Button>
					)}
				</div>
			</div>
			<hr
				style={{
					marginTop: '5vh',
					color: '#e7b7b7',
					backgroundColor: '#e7b7b7',
					border: 'none',
					height: '1px',
				}}
			/>
		</>
	);
}

export default MeuCadastro;
