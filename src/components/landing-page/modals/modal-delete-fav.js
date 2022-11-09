import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';

export default function ModalDeleteFav({
	openModalDeleteFavorite,
	setOpenModalDeleteFavorite,
	userSelected,
}) {
	const [loading, setLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');
	const location = useLocation();
	async function deleteContact(id) {
		setLoading(true);
		try {
			setLoading(true);
			await api.delete(`/api/favorito/remover/${id}`);
			setTimeout(() => {
				setLoading(false);
				setShowMsg(true);
				setMsg('Contato removido dos favoritos com sucesso!');
				setSeverity('success');
				setOpenModalDeleteFavorite(false);
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
		setOpenModalDeleteFavorite(false);
	};

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
				open={openModalDeleteFavorite}
				onClose={handleClose}
				style={{ textAlign: 'center', alignSelf: 'center' }}
				fullWidth
			>
				<DialogTitle>{`Tem certeza que deseja excluir o contato ${
					userSelected ? userSelected.pessoa.nome : ''
				}?`}</DialogTitle>

				<DialogActions>
					<Button onClick={() => setOpenModalDeleteFavorite(false)}>
						Cancelar
					</Button>
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
						<Button onClick={() => deleteContact(userSelected.id)}>Sim</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
