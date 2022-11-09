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
      <ModalAdd openModalAdd={openModalAdd} setOpenModalAdd={setOpenModalAdd} />
      <NavBar />

      <div
        style={{
          height: 400,
          width: '100%',
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
      <IconButton aria-label="add" onClick={() => setOpenModalAdd(true)}>
        <AddCircleIcon fontSize="large" color="primary" />
      </IconButton>
    </>
  );
}

export default Usuarios;
