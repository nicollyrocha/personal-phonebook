import * as React from 'react';
import NavBar from '../navbar/navbar';
import { useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import './usuarios.scss';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ModalEdit from './modalEdit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalAdd from './modalAdd';
import TableUsuarios from './table-usuarios';

function Usuarios() {
	const [rowsUsers, setRowsUsers] = React.useState([]);
	const [openModalEdit, setOpenModalEdit] = React.useState(false);

	useEffect(() => {
		searchContacts();
	}, []);

	async function searchContacts() {
		const contacts = await api.post(`/api/usuario/pesquisar`, {
			termo: '',
		});
		console.log('aqui', contacts);
		contacts.data.forEach((contact) => (contact.key = uuidv4()));
		setRowsUsers(contacts.data);
	}

	return (
		<>
			<NavBar />

			<div
				style={{
					height: 400,
					width: '100%',
					backgroundColor: 'white',
					marginTop: '15vh',
					textAlign: 'right',
					justifyContent: 'center',
				}}
			>
				<TableUsuarios
					rows={rowsUsers}
					setOpenModalEdit={setOpenModalEdit}
					openModalEdit={openModalEdit}
				/>
			</div>
			<IconButton
				aria-label="add"
				onClick={() => setOpenModalEdit(true)}
			>
				<AddCircleIcon
					fontSize="large"
					color="primary"
				/>
			</IconButton>
		</>
	);
}

export default Usuarios;
