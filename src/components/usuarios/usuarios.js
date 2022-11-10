import * as React from 'react';
import NavBar from '../navbar/navbar';
import { useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import './usuarios.scss';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalAdd from './modal-add';
import TableUsuarios from './table-usuarios';

function Usuarios() {
	const [rowsUsers, setRowsUsers] = React.useState([]);
	const [openModalEdit, setOpenModalEdit] = React.useState(false);
	const location = useLocation();

	useEffect(() => {
		searchContacts();
	}, []);

	const [openModalAdd, setOpenModalAdd] = React.useState(false);

	async function searchContacts() {
		const contacts = await api.post(`/api/usuario/pesquisar`, {
			termo: '',
			headers: {
				authorization: `Bearer ${location.state.data.token}`,
				Accept: '*/*',
			},
		});

		contacts.data.forEach((contact) => (contact.key = uuidv4()));
		setRowsUsers(contacts.data);
	}

	return (
		<>
			<ModalAdd
				openModalAdd={openModalAdd}
				setOpenModalAdd={setOpenModalAdd}
			/>
			<NavBar />

			<Box sx={{ maxWidth: '100vw', marginTop: '15vh' }}>
				<TableUsuarios
					rows={rowsUsers}
					setOpenModalEdit={setOpenModalEdit}
					openModalEdit={openModalEdit}
				/>
			</Box>
			<IconButton
				aria-label="add"
				onClick={() => setOpenModalAdd(true)}
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
