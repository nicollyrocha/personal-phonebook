import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';

export default function ModalAdd({ openModalAdd, setOpenModalAdd }) {
	const [telefone, setTelefone] = React.useState();
	const [cpf, setCpf] = React.useState();
	const [email, setEmail] = React.useState();
	const [nome, setNome] = React.useState();
	const [id, setId] = React.useState();
	const [username, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState(false);
	const [tipo, setTipo] = React.useState('');
	const [dataNascimento, setDataNascimento] = React.useState('');
	const [errorMsg, setErrorMsg] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	const location = useLocation();

	const Alert = React.forwardRef(function Alert(props, ref) {
		return (
			<MuiAlert
				elevation={6}
				ref={ref}
				variant="filled"
				{...props}
			/>
		);
	});

	const handleClose = () => {
		setOpenModalAdd(false);
	};

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
		setDataNascimento(dataFormatada);
	}

	async function addUser() {
		try {
			setIsLoading(true);

			const dados = {
				tipos: tipo,
				usuario: {
					cpf: cpf,
					dataNascimento: dataNascimento,
					email: email,
					id: Number(id),
					nome: nome,
					password: password,
					telefone: telefone,
					username: username,
				},
			};

			await api.post('api/usuario/salvar', dados, {
				headers: {
					Accept: ' */*',
					Authorization: `Bearer ${location.state.data.token}`,
					'Content-Type': 'application/json',
				},
			});

			setTimeout(() => {
				setIsLoading(false);
				setMsg('Usuário criado com sucesso!');
				setShowMsg(true);
				setSeverity('success');
				setOpenModalAdd(false);
				//window.location.reload(1);
			}, '2000');
		} catch (e) {
			setTimeout(() => {
				setIsLoading(false);

				setMsg(e.response !== undefined ? e.response.data.error : e);
				setShowMsg(true);
				setSeverity('error');
			}, '2000');
		}
	}

	function onBlurEmail() {
		const emailValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
		if (email.length === 0 || emailValid === true) {
			setEmail(email);

			setError(false);
			setErrorMsg('');
		} else {
			setError(true);
			setErrorMsg('Insira um e-mail válido.');
		}
	}

	return (
		<div style={{ columnCount: '3', width: '100vw' }}>
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
			<Dialog
				open={openModalAdd}
				onClose={handleClose}
				style={{
					display: 'flex',
					textAlign: 'center',
					alignSelf: 'center',
					flexDirection: 'column',
				}}
				fullWidth
			>
				<DialogTitle>Adicionar novo usuário.</DialogTitle>
				<div
					style={{
						textAlign: 'center',
						alignSelf: 'center',
						flexDirection: 'column',
					}}
				>
					<TextField
						id="outlined-basic"
						label="ID"
						variant="outlined"
						onChange={(e) => setId(e.target.value.replace(/^\D/g, ''))}
						value={id}
						style={{ padding: 5 }}
					/>
					<TextField
						id="outlined-basic"
						label="Nome"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setNome(e.target.value)}
					/>
					<TextField
						id="outlined-basic"
						label="E-mail"
						variant="outlined"
						onChange={(e) => setEmail(e.target.value)}
						onBlur={(e) => onBlurEmail(e)}
						helperText={errorMsg}
						error={error}
						style={{ padding: 5 }}
					/>
					<TextField
						id="outlined-basic"
						label="CPF"
						variant="outlined"
						value={cpf}
						onChange={(e) =>
							setCpf(
								e.target.value
									.replace(/\D/g, '')
									.replace(/(\d{3})(\d)/, '$1.$2')
									.replace(/(\d{3})(\d)/, '$1.$2')
									.replace(/(\d{3})(\d{1,2})/, '$1-$2')
									.replace(/(-\d{2})\d+?$/, '$1')
							)
						}
						style={{ padding: 5 }}
					/>
					<TextField
						id="outlined-basic"
						label="Telefone"
						variant="outlined"
						value={telefone}
						onChange={(e) =>
							setTelefone(
								e.target.value
									.replace(/\D/g, '')
									.replace(/(\d{2})(\d)/, '($1) $2')
									.replace(/(\d{4,5})(\d{4})/, '$1-$2')
							)
						}
						inputProps={{ maxLength: '15' }}
						style={{ padding: 5 }}
					/>
					<TextField
						id="outlined-basic"
						label="Tipo"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setTipo(e.target.value)}
					/>
					<TextField
						id="outlined-basic"
						style={{ padding: 5 }}
						label="Username"
						variant="outlined"
						onChange={(e) => setUserName(e.target.value)}
					/>
					<TextField
						id="outlined-basic"
						label="Password"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
					/>
					<LocalizationProvider
						dateAdapter={AdapterDayjs}
						style={{
							opacity: '1',
							backgroundColor: 'white',
							margin: 10,
							width: '5vw',
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
								value={dataNascimento}
								onChange={(newValue) => onChangeDate(newValue)}
								maxDate={new Date()}
								renderInput={({ inputRef, inputProps, InputProps }) => (
									<>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignSelf: 'center',
												marginLeft: '6vw',
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
													value={dataNascimento}
													style={{
														textAlign: 'center',
														width: '10vw',
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
				</div>
				<DialogActions>
					<Button onClick={() => handleClose()}>Cancelar</Button>
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
						<Button onClick={() => addUser()}>Salvar</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
