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
	const [tag, setTag] = React.useState('');
	const [tipoContato, setTipoContato] = React.useState('');
	const [telefone, setTelefone] = React.useState('');
	const [cpf, setCpf] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [nome, setNome] = React.useState('');
	const [id, setId] = React.useState();
	const [error, setError] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [privado, setPrivado] = React.useState(false);
	const [userData, setUserData] = React.useState();
	const [image, setImage] = React.useState();
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	let idImage;

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
		setOpenModalEdit(false);
	};

	async function searchUserData() {
		try {
			const pessoaData = await api.get(
				`/api/pessoa/buscar/${location.state.data.id}`
			);
			const userData = await api.get(
				`/api/usuario/buscar/${location.state.data.id}`
			);

			setNome(pessoaData.data.object.nome);
			setCpf(userSelected.pessoa.cpf);
			setId(userSelected.id);
			setCep(pessoaData.data.object.endereco.cep);
			setNumero(pessoaData.data.object.endereco.numero);
			setLogradouro(pessoaData.data.object.endereco.logradouro);
			setBairro(pessoaData.data.object.endereco.bairro);
			setCidade(pessoaData.data.object.endereco.cidade);
			setEstado(pessoaData.data.object.endereco.estado);
			setPais(pessoaData.data.object.endereco.pais);
			setTag(userSelected.tag);
			setTipoContato(userSelected.tipoContato);
			setId(userSelected.id);
			setTelefone(userSelected.telefone ? userSelected.telefone : '');
			setPrivado(userSelected.privado);
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
				logradouro: pessoaData.data.object.endereco.logradouro,
				bairro: pessoaData.data.object.endereco.bairro,
				cidade: pessoaData.data.object.endereco.cidade,
				estado: pessoaData.data.object.endereco.estado,
				pais: pessoaData.data.object.endereco.pais,
				numero: pessoaData.data.object.endereco.numero,
			});
		} catch (e) {
			setShowMsg(true);
			setMsg(e);
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

	const onFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	async function addContact() {
		const formData = new FormData();
		formData.append('foto', image);

		try {
			setIsLoading(true);

			const sendImage = await api.post(
				`api/foto/upload/${userData.id}`,
				formData,
				{
					headers: {
						Accept: ' */*',
						Authorization: `Bearer ${location.state.data.token}`,
						'Content-Type': 'multipart/form-data',
						Origin: 'https://metawaydemo.vps-kinghost.net:8485',
						Host: 'metawaydemo.vps-kinghost.net:8485',
					},
				}
			);

			idImage = sendImage.data.object.id;
			const dados = {
				cpf: cpf !== '' ? cpf : userData.cpf,
				endereco: {
					bairro: bairro !== '' ? bairro : userData.bairro,
					cep: cep !== '' ? cep : userData.cep,
					cidade: cidade !== '' ? cidade : userData.cidade,
					estado: estado !== '' ? estado : userData.estado,
					id: id !== '' ? id : userData.id,
					logradouro: logradouro !== '' ? logradouro : userData.logradouro,
					numero: numero !== '' ? numero : userData.numero,
					pais: pais !== '' ? pais : userData.pais,
				},
				foto: {
					id: idImage,
					name: 'foto',
					type: 'image/jpeg',
				},
				id: id !== '' ? id : userData.id,
				nome: nome !== '' ? nome : userData.nome,
			};

			await api.post('api/pessoa/salvar', dados, {
				headers: {
					Accept: ' */*',
					Authorization: `Bearer ${location.state.data.token}`,
					'Content-Type': 'application/json',
				},
			});

			const dadosContato = {
				email: email,
				id: id,
				pessoa: {
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
						id: idImage,
						name: 'foto',
						type: 'image/jpeg',
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
			};

			await api.post('api/contato/salvar', dadosContato, {
				headers: {
					Accept: ' */*',
					Authorization: `Bearer ${location.state.data.token}`,
					'Content-Type': 'application/json',
				},
			});

			setTimeout(() => {
				setIsLoading(false);
				setMsg('Pessoa alterada com sucesso!');
				setShowMsg(true);
				setSeverity('success');
				setOpenModalEdit(false);
				window.location.reload(1);
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

	return (
		<div style={{ display: 'flex', textAlign: 'center', columnCount: '3' }}>
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
				<DialogTitle>Editar contato.</DialogTitle>
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
							nome === ''
								? userSelected
									? userSelected.pessoa.nome
									: ''
								: nome
						}
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
						defaultValue={email === '' ? userSelected.email : email}
					/>
					<TextField
						id="outlined-basic"
						label={
							userSelected.pessoa.cpf !== ''
								? `CPF - ${userSelected.pessoa.cpf}`
								: 'CPF'
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
							userSelected.telefone !== ''
								? `Telefone - ${userSelected.telefone}`
								: 'Telefone'
						}
						variant="outlined"
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
						value={telefone}
					/>
					<TextField
						id="outlined-basic"
						label="Tipo Contato"
						variant="outlined"
						style={{ padding: 5 }}
						onChange={(e) => setTipoContato(e.target.value)}
						defaultValue={
							tipoContato === ''
								? userSelected
									? userSelected.tipoContato
									: ''
								: tipoContato
						}
					/>
					<TextField
						id="outlined-basic"
						style={{ padding: 5 }}
						label="Tag"
						variant="outlined"
						onChange={(e) => setTag(e.target.value)}
						defaultValue={
							tag === '' ? (userSelected ? userSelected.tag : '') : tag
						}
					/>
					<TextField
						id="outlined-basic"
						label={
							userSelected.pessoa.endereco.cep !== ''
								? `CEP - ${userSelected.pessoa.endereco.cep}`
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
									? userSelected.pessoa.endereco.pais
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
									? userSelected.pessoa.endereco.estado
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
									? userSelected.pessoa.endereco.cidade
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
									? userSelected.pessoa.endereco.bairro
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
									? userSelected.pessoa.endereco.logradouro
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
									? userSelected.pessoa.endereco.numero
									: ''
								: numero
						}
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
							value={
								userSelected
									? userSelected.privado === true
										? 'sim'
										: 'nao'
									: ''
							}
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
					<input
						type="file"
						name="user[image]"
						onChange={onFileChange}
						style={{ width: '10vw' }}
					/>
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
						<Button onClick={() => addContact()}>Salvar</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
