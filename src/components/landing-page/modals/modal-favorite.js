import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../../services/api';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';

export default function ModalFavorite({
	openModalFavorite,
	setOpenModalFavorite,
	userSelected,
}) {
	const [loading, setLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	const location = useLocation();

	async function addFavorites(id) {
		try {
			setLoading(true);
			await api.post(`/api/favorito/salvar/`, {
				email: userSelected.email,
				id: userSelected.id,
				pessoa: {
					cpf: userSelected.pessoa.cpf,
					endereco: {
						bairro: userSelected.pessoa.endereco.bairro,
						cep: userSelected.pessoa.endereco.cep,
						cidade: userSelected.pessoa.endereco.cidade,
						estado: userSelected.pessoa.endereco.estado,
						id: userSelected.pessoa.endereco.id,
						logradouro: userSelected.pessoa.endereco.logradouro,
						numero: userSelected.pessoa.endereco.numero,
						pais: userSelected.pessoa.endereco.pais,
					},
					foto: {
						id: userSelected.pessoa.foto.id,
						name: userSelected.pessoa.foto.name,
						type: userSelected.pessoa.foto.type,
					},
					id: userSelected.pessoa.id,
					nome: userSelected.pessoa.nome,
				},
				privado: userSelected.privado,
				tag: userSelected.tag,
				telefone: userSelected.telefone,
				tipoContato: userSelected.tipoContato,
				usuario: {
					cpf: userSelected.usuario.cpf,
					dataNascimento: userSelected.usuario.dataNascimento,
					email: userSelected.usuario.email,
					id: userSelected.usuario.id,
					nome: userSelected.usuario.nome,
					password: userSelected.usuario.password,
					telefone: userSelected.usuario.telefone,
					username: userSelected.usuario.username,
				},
			});
			setTimeout(() => {
				setLoading(false);
				setShowMsg(true);
				setMsg('Contato adicionado aos favoritos!');
				setSeverity('success');
				setOpenModalFavorite(false);
				window.location.reload(1);
			}, '2000');
		} catch (e) {
			console.log(e);
			setShowMsg(true);
			setMsg(e.response.data.error);
			setSeverity('error');
		}
	}

	const handleClose = () => {
		setOpenModalFavorite(false);
	};
	console.log(userSelected);
	return (
		<div style={{ display: 'flex', textAlign: 'center' }}>
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
				open={openModalFavorite}
				onClose={handleClose}
				style={{ textAlign: 'center', alignSelf: 'center' }}
				fullWidth
			>
				<DialogTitle>{`Adicionar o contato ${
					userSelected ? userSelected.pessoa.nome : ''
				} aos favoritos?`}</DialogTitle>

				<DialogActions>
					<Button onClick={() => setOpenModalFavorite(false)}>Cancelar</Button>
					{loading === true ? (
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
						<Button onClick={() => addFavorites(userSelected.id)}>Sim</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
