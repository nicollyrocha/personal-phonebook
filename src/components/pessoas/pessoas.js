import * as React from 'react';
import NavBar from '../navbar/navbar';
import './landing-page.scss';
import { useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TablePessoas from './table-pessoas';
import ModalDelete from './modals/modal-delete';
import ModalAdd from './modals/modal-add';
import ModalEdit from './modals/modal-edit';

function Pessoas({ setLogado }) {
	function TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<Box sx={{ p: 3 }}>
						<Typography>{children}</Typography>
					</Box>
				)}
			</div>
		);
	}

	const [rowsPeople, setRowsPeople] = React.useState([]);
	const contactsData = [];
	const location = useLocation();
	const dados = location.state.data;
	const [openModalDelete, setOpenModalDelete] = React.useState(false);
	const [openModalAdd, setOpenModalAdd] = React.useState(false);
	const [openModalEdit, setOpenModalEdit] = React.useState(false);
	const [userSelected, setUserSelected] = React.useState('');

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
	};

	useEffect(() => {
		searchPeople();
	}, []);

	async function searchPeople() {
		try {
			const contacts = await api.post(`/api/pessoa/pesquisar`, {
				nome: '',
			});

			contacts.data.forEach((contact) => (contact.key = uuidv4()));
			setRowsPeople(contacts.data);
			contacts.data.forEach((contact) => contactsData.push(contact));
		} catch (e) {}
	}

	return (
		<>
			<ModalAdd
				openModalAdd={openModalAdd}
				setOpenModalAdd={setOpenModalAdd}
			/>
			{userSelected ? (
				<>
					<ModalDelete
						openModalDelete={openModalDelete}
						setOpenModalDelete={setOpenModalDelete}
						userSelected={userSelected}
					/>
					<ModalEdit
						openModalEdit={openModalEdit}
						setOpenModalEdit={setOpenModalEdit}
						userSelected={userSelected}
						setUserSelected={setUserSelected}
					/>{' '}
				</>
			) : (
				''
			)}
			<NavBar
				dados={dados}
				setLogado={setLogado}
			/>
			<Box sx={{ maxWidth: '100vw', marginTop: '15vh' }}>
				<TablePessoas
					rows={rowsPeople}
					setUserSelected={setUserSelected}
					setOpenModalDelete={setOpenModalDelete}
					setOpenModalEdit={setOpenModalEdit}
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

export default Pessoas;
