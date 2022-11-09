import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { v4 as uuidv4 } from 'uuid';

export default function ModalEdit({
	openModalEdit,
	setOpenModalEdit,
	userSelected,
	setUserSelected,
}) {
	const [cep, setCep] = React.useState('');
	const [pais, setPais] = React.useState('');
	const [estado, setEstado] = React.useState('');
	const [cidade, setCidade] = React.useState('');
	const [bairro, setBairro] = React.useState('');
	const [logradouro, setLogradouro] = React.useState('');
	const [numero, setNumero] = React.useState('');
	const [cpf, setCpf] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [nome, setNome] = React.useState('');
	const [id, setId] = React.useState();
	const [userData, setUserData] = React.useState();
	const [openErrorMsg, setOpenErrorMsg] = React.useState(false);
	const [msgRequest, setMsgRequest] = React.useState('');
	const [image, setImage] = React.useState();
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	const location = useLocation();
	let state = {
		file: null,
	};
	let formData = new FormData();

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
		setOpenModalEdit(false);
	};

	async function searchUserData() {
		try {
			const userData = await api.get(`/api/pessoa/buscar/${userSelected.id}`);
			setUserData(userData.data.object);
			setImage(userData.data.object.foto);
			setNome(userData.data.object.nome);
			setCpf(userData.data.object.cpf);
			setId(userData.data.object.id);
			setCep(userData.data.object.endereco.cep);
			setNumero(userData.data.object.endereco.numero);
			setLogradouro(userData.data.object.endereco.logradouro);
			setBairro(userData.data.object.endereco.bairro);
			setCidade(userData.data.object.endereco.cidade);
			setEstado(userData.data.object.endereco.estado);
			setPais(userData.data.object.endereco.pais);
			console.log('aaaa', userData);
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

	const onFileChange = (e) => {
		console.log(e.target.files[0]);
		setImage(e.target.files[0]);
	};

	async function addContact(e) {
		const formData = new FormData();
		formData.append('foto', image);

		try {
			console.log('entrou');
			setIsLoading(true);
			console.log('dataaaaa', userData);
			const dados = {
				cpf: cpf !== '' ? cpf : userData.cpf,
				endereco: {
					bairro: bairro !== '' ? bairro : userData.endereco.bairro,
					cep: cep !== '' ? cep : userData.endereco.cep,
					cidade: cidade !== '' ? cidade : userData.endereco.cidade,
					estado: estado !== '' ? estado : userData.endereco.estado,
					id: id !== '' ? id : userData.endereco.id,
					logradouro:
						logradouro !== '' ? logradouro : userData.endereco.logradouro,
					numero: numero !== '' ? numero : userData.endereco.numero,
					pais: pais !== '' ? pais : userData.endereco.pais,
				},
				foto: {
					id: '6dde0026-329c-4100-95a8-48abb7fd72c4',
					name: 'foto',
					type: 'image/jpeg',
				},
				id: id !== '' ? id : userData.id,
				nome: nome !== '' ? nome : userData.nome,
			};
			await api.post(`api/foto/upload/${userData.id}`, formData, {
				headers: {
					Accept: ' */*',
					Authorization: `Bearer ${location.state.data.token}`,
					'Content-Type': 'multipart/form-data',
					Origin: 'https://metawaydemo.vps-kinghost.net:8485',
					Host: 'metawaydemo.vps-kinghost.net:8485',
				},
			});
			console.log('image', image);
			await api.post('api/pessoa/salvar', dados, {
				headers: {
					Accept: ' */*',
					Authorization: `Bearer ${location.state.data.token}`,
					'Content-Type': 'application/json',
					Origin: 'https://metawaydemo.vps-kinghost.net:8485',
					Host: 'metawaydemo.vps-kinghost.net:8485',
				},
			});

			setTimeout(() => {
				setIsLoading(false);
				setMsg('Pessoa alterada com sucesso!');
				setShowMsg(true);
				setSeverity('success');
				setOpenModalEdit(false);
			}, '2000');
			window.location.reload(1);
		} catch (e) {
			console.log(e);
			setTimeout(() => {
				setIsLoading(false);
				setMsg(e);
				setShowMsg(true);
				setSeverity('error');
			}, '2000');
		}
	}

	return (
		<>
			<div>
				{showMsg === true ? (
					<Snackbar
						open={openErrorMsg}
						autoHideDuration={6000}
						onClose={() => setOpenErrorMsg(false)}
					>
						<Alert severity={severity}>{msg}</Alert>
					</Snackbar>
				) : null}
			</div>
			<div style={{ display: 'flex', textAlign: 'center' }}>
				<Dialog
					open={openModalEdit}
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
					<DialogTitle>Editar pessoa.</DialogTitle>
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
							style={{ padding: 5 }}
							defaultValue={!id ? userSelected.id : id}
						/>
						<TextField
							id="outlined-basic"
							label="Nome"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setNome(e.target.value)}
							defaultValue={
								nome === '' ? (userSelected ? userSelected.nome : '') : nome
							}
						/>
						<TextField
							id="outlined-basic"
							label={
								userSelected.cpf !== '' ? `CPF - ${userSelected.cpf}` : 'CPF'
							}
							variant="outlined"
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
							value={cpf}
						/>

						<TextField
							id="outlined-basic"
							label={
								userSelected.endereco.cep !== ''
									? `CEP - ${userSelected.endereco.cep}`
									: 'CEP'
							}
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => onChangeCep(e)}
							inputProps={{ maxLength: '9' }}
							onBlur={() => onBlurCep()}
							value={cep}
						/>
						<TextField
							id="outlined-basic"
							label="País"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setPais(e.target.value)}
							defaultValue={
								pais === ''
									? userSelected
										? userSelected.endereco.pais
										: ''
									: pais
							}
						/>
						<TextField
							id="outlined-basic"
							label="Estado"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setEstado(e.target.value)}
							defaultValue={
								estado === ''
									? userSelected
										? userSelected.endereco.estado
										: ''
									: estado
							}
						/>
						<TextField
							id="outlined-basic"
							label="Cidade"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setCidade(e.target.value)}
							defaultValue={
								cidade === ''
									? userSelected
										? userSelected.endereco.cidade
										: ''
									: cidade
							}
						/>
						<TextField
							id="outlined-basic"
							label="Bairro"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setBairro(e.target.value)}
							defaultValue={
								bairro === ''
									? userSelected
										? userSelected.endereco.bairro
										: ''
									: bairro
							}
						/>
						<TextField
							id="outlined-basic"
							label="Logradouro"
							variant="outlined"
							style={{ padding: 5 }}
							onChange={(e) => setLogradouro(e.target.value)}
							defaultValue={
								logradouro === ''
									? userSelected
										? userSelected.endereco.logradouro
										: ''
									: logradouro
							}
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
							defaultValue={
								numero === ''
									? userSelected
										? userSelected.endereco.numero
										: ''
									: numero
							}
						/>
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
								accept="*/*"
								onClick={onFileChange}
							/>
						</Button>
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
							<Button onClick={(e) => addContact(e)}>Salvar</Button>
						)}
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
}
