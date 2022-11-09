import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import { useLocation } from 'react-router-dom';

export default function ModalDelete({
	openModalDelete,
	setOpenModalDelete,
	userSelected,
}) {
	const location = useLocation();

	async function deleteContact(id) {
		try {
			await api.delete(`/api/contato/remover/${id}`);
			window.location.reload(1);
		} catch (e) {
			console.log(e);
		}
	}

	const handleClose = () => {
		setOpenModalDelete(false);
	};

	return (
		<div style={{ display: 'flex', textAlign: 'center' }}>
			<Dialog
				open={openModalDelete}
				onClose={handleClose}
				style={{ textAlign: 'center', alignSelf: 'center' }}
				fullWidth
			>
				<DialogTitle>{`Tem certeza que deseja excluir o contato ${
					userSelected ? userSelected.pessoa.nome : ''
				}?`}</DialogTitle>

				<DialogActions>
					<Button onClick={() => setOpenModalDelete(false)}>Cancelar</Button>
					<Button onClick={() => deleteContact(userSelected.id)}>Sim</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
