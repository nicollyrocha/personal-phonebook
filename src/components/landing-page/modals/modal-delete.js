import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../../services/api';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

export default function ModalDelete({
  openModalDelete,
  setOpenModalDelete,
  userSelected,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('');
  const [openErrorMsg, setOpenErrorMsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  async function deleteContact(id) {
    setIsLoading(true);
    try {
      await api.delete(`/api/contato/remover/${id}`);
      setTimeout(() => {
        setIsLoading(false);
        setMsg('Pessoa alterada com sucesso!');
        setShowMsg(true);
        setSeverity('success');
        setOpenModalDelete(false);
      }, '2000');
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
        setMsg(e.response.data.error);
        setShowMsg(true);
        setSeverity('error');
      }, '2000');
    }
  }

  const handleClose = () => {
    setOpenModalDelete(false);
  };

  return (
    <div style={{ display: 'flex', textAlign: 'center' }}>
      {showMsg === true ? (
        <Snackbar
          open={openErrorMsg}
          autoHideDuration={6000}
          onClose={() => setOpenErrorMsg(false)}
        >
          <Alert severity={severity}>{msg}</Alert>
        </Snackbar>
      ) : null}
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
