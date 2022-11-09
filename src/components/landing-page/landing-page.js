import * as React from 'react';
import NavBar from '../navbar/navbar';
import './landing-page.scss';
import { useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalDelete from './modals/modal-delete';
import ModalAdd from './modals/modal-add';
import TableContatos from './tables/table-contatos';
import TableFavoritos from './tables/table-favoritos';
import ModalEdit from './modals/modal-edit';
import ModalFavorite from './modals/modal-favorite';
import ModalDeleteFav from './modals/modal-delete-fav';

function LandingPage() {
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

  const [rowsContacts, setRowsContacts] = React.useState([]);
  const contactsData = [];
  const location = useLocation();
  const dados = location.state.data;
  const [value, setValue] = React.useState(0);
  const [favoritesData, setFavoritesData] = React.useState([]);
  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const [openModalEdit, setOpenModalEdit] = React.useState(false);
  const [openModalFavorite, setOpenModalFavorite] = React.useState(false);
  const [openModalDeleteFavorite, setOpenModalDeleteFavorite] =
    React.useState(false);
  const [userSelected, setUserSelected] = React.useState('');

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    searchContacts();
    searchFavorites();
  }, []);

  async function searchContacts() {
    try {
      const contacts = await api.get(
        `/api/contato/listar/${location.state.data.id}`,
        {
          headers: { Authorization: `Bearer ${location.state.data.token}` },
        }
      );
      contacts.data.forEach((contact) => (contact.key = uuidv4()));
      setRowsContacts(contacts.data);
      contacts.data.forEach((contact) => contactsData.push(contact));
    } catch (e) {}
  }

  async function searchFavorites() {
    try {
      const favorites = await api.get(`/api/favorito/pesquisar`, {
        headers: { Authorization: `Bearer ${location.state.data.token}` },
      });
      favorites.data.forEach((contact) => (contact.key = uuidv4()));

      var retorno = favorites.data.filter(
        (favorite) => favorite.usuario.id === location.state.data.id
      );
      setFavoritesData(retorno);
      favorites.data.forEach((contact) => contactsData.push(contact.pessoa));
    } catch (e) {}
  }

  return (
    <>
      {userSelected ? (
        <>
          <ModalDelete
            openModalDelete={openModalDelete}
            setOpenModalDelete={setOpenModalDelete}
            userSelected={userSelected}
          />
          <ModalAdd
            openModalAdd={openModalAdd}
            setOpenModalAdd={setOpenModalAdd}
          />
          <ModalEdit
            openModalEdit={openModalEdit}
            setOpenModalEdit={setOpenModalEdit}
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
          <ModalFavorite
            openModalFavorite={openModalFavorite}
            setOpenModalFavorite={setOpenModalFavorite}
            userSelected={userSelected}
          />
          <ModalDeleteFav
            openModalDeleteFavorite={openModalDeleteFavorite}
            setOpenModalDeleteFavorite={setOpenModalDeleteFavorite}
            userSelected={userSelected}
          />{' '}
        </>
      ) : (
        ''
      )}

      <NavBar dados={dados} />
      <Box sx={{ width: '100%', marginTop: '5vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Contatos" {...a11yProps(0)} />
            <Tab label="Favoritos" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div
            style={{
              height: 400,
              width: '100%',
              backgroundColor: 'white',
              marginTop: '5vh',
            }}
          >
            <TableContatos
              rows={rowsContacts}
              setUserSelected={setUserSelected}
              setOpenModalDelete={setOpenModalDelete}
              setOpenModalEdit={setOpenModalEdit}
              setOpenModalFavorite={setOpenModalFavorite}
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{
              height: 400,
              width: '100%',
              backgroundColor: 'white',
              marginTop: '5vh',
            }}
          >
            <TableFavoritos
              rows={favoritesData}
              setUserSelected={setUserSelected}
              setOpenModalDeleteFavorite={setOpenModalDeleteFavorite}
            />
          </div>
        </TabPanel>
      </Box>
      <IconButton aria-label="add">
        <AddCircleIcon
          fontSize="large"
          color="primary"
          onClick={() => setOpenModalAdd(true)}
        />
      </IconButton>
    </>
  );
}

export default LandingPage;
