import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ModalDelete({
	openModalDelete,
	setOpenModalDelete,
	userSelected,
}) {
	const location = useLocation();
	const [isLoading, setIsLoading] = React.useState(false);
	const [showMsg, setShowMsg] = React.useState(false);
	const [msg, setMsg] = React.useState('');
	const [severity, setSeverity] = React.useState('');

	async function deleteContact(id) {
		try {
			setIsLoading(true);
			await api.delete(`/api/pessoa/remover/${id}`);
			setTimeout(() => {
				setIsLoading(false);
				setShowMsg(true);
				setMsg('Pessoa deletada com sucesso!');
				setSeverity('success');
				setOpenModalDelete(false);
				window.location.reload(1);
			}, '2000');
		} catch (e) {
			setIsLoading(false);

			setShowMsg(true);
			setMsg(e.response.data.message);
			setSeverity('error');
		}
	}

	const handleClose = () => {
		setOpenModalDelete(false);
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
				open={openModalDelete}
				onClose={handleClose}
				style={{ textAlign: 'center', alignSelf: 'center' }}
				fullWidth
			>
				<DialogTitle>{`Tem certeza que deseja excluir o contato ${
					userSelected ? userSelected.nome : ''
				}?`}</DialogTitle>

				<DialogActions>
					<Button onClick={() => setOpenModalDelete(false)}>Cancelar</Button>
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
						<Button onClick={() => deleteContact(userSelected.id)}>Sim</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
