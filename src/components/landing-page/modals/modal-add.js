import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/system';
import api from '../../../services/api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function ModalAdd({ openModalAdd, setOpenModalAdd }) {
	const [cep, setCep] = React.useState('');
	const [pais, setPais] = React.useState('');
	const [estado, setEstado] = React.useState('');
	const [cidade, setCidade] = React.useState('');
	const [bairro, setBairro] = React.useState('');
	const [logradouro, setLogradouro] = React.useState('');
	const [numero, setNumero] = React.useState();
	const [tag, setTag] = React.useState();
	const [tipoContato, setTipoContato] = React.useState();
	const [telefone, setTelefone] = React.useState();
	const [cpf, setCpf] = React.useState();
	const [email, setEmail] = React.useState();
	const [nome, setNome] = React.useState();
	const [id, setId] = React.useState();
	const [error, setError] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [privado, setPrivado] = React.useState(false);
	const [userData, setUserData] = React.useState();
	const [openErrorMsg, setOpenErrorMsg] = React.useState(false);
	const [msgRequest, setMsgRequest] = React.useState('');
	const [image, setImage] = React.useState();
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

	React.useEffect(() => {
		searchUserData();
	}, []);

	const handleClose = () => {
		setOpenModalAdd(false);
	};

	async function searchUserData() {
		try {
			const userData = await api.get(
				`/api/usuario/buscar/${location.state.data.id}`
			);
			setUserData({
				...userData,
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
			setOpenErrorMsg(true);
			setMsgRequest(e);
			console.log(e);
		}
	}

	function onChangeCep(e) {
		var v = e.target.value.replace(/\D/g, '');

		v = v.replace(/^(\d{5})(\d)/, '$1-$2');

		e.target.value = v;
		setCep(v);
	}

	async function onBlurCep() {
		fetch(`https://viacep.com.br/ws/${cep}/json/`)
			.then((res) => res.json())
			.then((data) => {
				setPais(data.pais);
				setEstado(data.uf);
				setCidade(data.localidade);
				setBairro(data.bairro);
				setLogradouro(data.logradouro);
				console.log(data);
			});
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

	async function addContact() {
		try {
			const formData = new FormData();
			formData.append('file', image);
			console.log('data', image);
			if (!image) {
				const res = await api
					.post(`api/foto/upload/${userData.id}`, {
						method: 'POST',
						body: image,
					})
					.then((res) => res.json());
				alert(JSON.stringify(`${res.message}, status: ${res.status}`));
			}

			await api.post('api/pessoa/salvar', {
				cpf: cpf,
				endereco: {
					bairro: bairro,
					cep: cep,
					cidade: cidade,
					estado: estado,
					id: id,
					logradouro: logradouro,
					numero: numero,
					pais: pais,
				},
				foto: {
					id: userData.id,
					name: image.name,
					type: image.type,
				},
				id: id,
				nome: nome,
			});

			await api.post('api/contato/salvar', {
				email: email,
				id: id,
				pessoa: {
					cpf: cpf,
					endereco: {
						bairro: bairro,
						cep: cep,
						cidade: cidade,
						estado: estado,
						id: 0,
						logradouro: logradouro,
						numero: numero,
						pais: pais,
					},
					foto: {
						id: userData.id,
						name: image.name,
						type: image.type,
					},
					id: id,
					nome: nome,
				},
				privado: privado,
				tag: tag,
				telefone: telefone,
				tipoContato: tipoContato,
				usuario: {
					cpf: userData.cpf,
					dataNascimento: userData.dataNascimento,
					email: userData.email,
					id: userData.id,
					nome: userData.name,
					password: userData.password,
					telefone: userData.number,
					username: userData.user,
				},
			});

			setOpenErrorMsg(true);
			setMsgRequest('Contato criado com sucesso!');
			setOpenModalAdd(false);
			window.location.reload(1);
		} catch (e) {
			console.log(e);
			setOpenErrorMsg(true);
			setMsgRequest(e.response.data.error);
		}
	}

	return (
		<div style={{ display: 'flex', textAlign: 'center', columnCount: '3' }}>
			{openErrorMsg === true ? (
				<>
					<Snackbar
						open={openErrorMsg}
						autoHideDuration={6000}
						onClose={() => setOpenErrorMsg(false)}
					>
						<Alert severity="error">
							{msgRequest !== '' ? msgRequest : ''}
						</Alert>
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
					columnCount: '3',
				}}
				fullWidth
			>
				<DialogTitle>Adicionar novo contato.</DialogTitle>
				<div
					style={{
						textAlign: 'center',
						alignSelf: 'center',
						flexDirection: 'column',
						columnCount: 3,
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
						label="Tipo Contato"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setTipoContato(e.target.value)}
					/>
					<TextField
						id="outlined-basic"
						style={{ padding: 5 }}
						label="Tag"
						variant="outlined"
						onChange={(e) => setTag(e.target.value)}
					/>
					<TextField
						id="outlined-basic"
						label="CEP"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => onChangeCep(e)}
						inputProps={{ maxLength: '9' }}
						onBlur={() => onBlurCep()}
					/>
					<TextField
						id="outlined-basic"
						label="País"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setPais(e.target.value)}
						value={pais}
					/>
					<TextField
						id="outlined-basic"
						label="Estado"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setEstado(e.target.value)}
						value={estado}
					/>
					<TextField
						id="outlined-basic"
						label="Cidade"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setCidade(e.target.value)}
						value={cidade}
					/>
					<TextField
						id="outlined-basic"
						label="Bairro"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setBairro(e.target.value)}
						value={bairro}
					/>
					<TextField
						id="outlined-basic"
						label="Logradouro"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setLogradouro(e.target.value)}
						value={logradouro}
					/>
					<TextField
						id="outlined-basic"
						label="Número"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => {
							var v = e.target.value.replace(/\D/g, '');

							v = v.replace(/^\D/, '');

							e.target.value = v;
							setNumero(v);
						}}
					/>
					<br />
					<div style={{ padding: 10 }}>
						<FormLabel id="demo-radio-buttons-group-label">Privado?</FormLabel>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							style={{
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'center',
							}}
							onChange={(e) =>
								e.target.value === 'sim' ? setPrivado(true) : setPrivado(false)
							}
							row
						>
							<FormControlLabel
								value="sim"
								control={<Radio />}
								label="Sim"
							/>
							<FormControlLabel
								value="nao"
								control={<Radio />}
								label="Não"
							/>
						</RadioGroup>
					</div>
				</div>
				<Button
					variant="contained"
					component="label"
					style={{
						backgroundColor: '#cf2e2e',
						width: '10vw',
						alignSelf: 'center',
					}}
				>
					Upload File
					<input
						type="file"
						hidden
						accept="image/*"
						onClick={(e) => setImage(e.currentTarget.files[0])}
					/>
				</Button>
				<DialogActions>
					<Button onClick={() => handleClose()}>Cancelar</Button>
					<Button onClick={() => addContact()}>Salvar</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
