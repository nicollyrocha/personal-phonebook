import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';

export default function ModalAdd({ openModalAdd, setOpenModalAdd }) {
	const [cep, setCep] = React.useState('');
	const [pais, setPais] = React.useState('');
	const [estado, setEstado] = React.useState('');
	const [cidade, setCidade] = React.useState('');
	const [bairro, setBairro] = React.useState('');
	const [logradouro, setLogradouro] = React.useState('');
	const [numero, setNumero] = React.useState();
	const [cpf, setCpf] = React.useState();
	const [nome, setNome] = React.useState();
	const [id, setId] = React.useState();
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	const [image, setImage] = React.useState();

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
	console.log('a');
	async function addContact() {
		try {
			setIsLoading(true);

			await api.post(`api/foto/upload/${id}`, image, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});

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
					id: image.id,
					name: image.name,
					type: image.type,
				},
				id: id,
				nome: nome,
			});

			setTimeout(() => {
				setIsLoading(false);
				setMsg('Pessoa alterada com sucesso!');
				setShowMsg(true);
				setSeverity('success');
				setOpenModalAdd(false);
			}, '2000');
			window.location.reload(1);
		} catch (e) {
			console.log(e);
			setTimeout(() => {
				setIsLoading(false);
				setMsg(e.response.data.error);
				setShowMsg(true);
				setSeverity('error');
			}, '2000');
		}
	}

	return (
		<div style={{ display: 'flex', textAlign: 'center', columnCount: '3' }}>
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
				{showMsg === true ? (
					<>
						<Snackbar
							open={showMsg}
							autoHideDuration={6000}
							onClose={() => setShowMsg(false)}
						>
							<Alert severity={severity}>{msg}</Alert>
						</Snackbar>
					</>
				) : null}
				<DialogTitle>Adicionar nova pessoa.</DialogTitle>
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
						onClick={(e) =>
							setImage({
								id: uuidv4(),
								name: e.target.files[0].name,
								type: e.target.files[0].type,
							})
						}
					/>
				</Button>
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
