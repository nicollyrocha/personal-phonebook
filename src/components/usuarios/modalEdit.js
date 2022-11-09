import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/system';
import api from '../../services/api';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ModalEdit({
  openModalEdit,
  setOpenModalEdit,
  userSelected,
  initialData,
  setInitialData,
}) {
  const [userData, setUserData] = React.useState({
    tipos: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    id: '',
    nome: '',
    password: '',
    telefone: '',
    username: '',
  });
  const [error, setError] = React.useState({ email: false, password: false });
  const [errorMsg, setErrorMsg] = React.useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMsg, setShowMsg] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [severity, setSeverity] = React.useState('');

  useEffect(() => {}, []);

  function onChangeDate(newValue) {
    const dataCompleta = new Date(newValue);
    const ano = dataCompleta.getFullYear();
    let dia = dataCompleta.getDate();
    let mes = dataCompleta.getMonth() + 1;

    if (dia < 10) {
      dia = `0${dia}`;
    }

    if (mes < 10) {
      mes = `0${mes}`;
    }

    const dataFormatada = `${ano}-${mes}-${dia}`;
    setUserData({ ...userData, dataNascimento: dataFormatada });
  }

  const handleClose = () => {
    setOpenModalEdit(false);
  };

  function onBlurEmail() {
    const emailValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(
      userData.email
    );
    if (userData.email === '' || emailValid === true) {
      setUserData({
        ...userData,
        email: userData.email,
      });

      setError({ ...error, email: false });
      setErrorMsg({ ...errorMsg, email: '' });
    } else {
      setError({ ...error, email: true });
      setErrorMsg({ ...errorMsg, email: 'Insira um e-mail válido.' });
    }
  }

  async function sendData() {
    try {
      setIsLoading(true);
      await api.post('/api/usuario/salvar', {
        usuario: {
          cpf: userData.cpf !== '' ? userData.cpf : initialData.usuario.cpf,
          dataNascimento:
            userData.dataNascimento !== ''
              ? userData.dataNascimento
              : initialData.usuario.dataNascimento,
          email:
            userData.email !== '' ? userData.email : initialData.usuario.email,
          id: userData.id !== '' ? userData.id : initialData.usuario.id,
          nome: userData.nome !== '' ? userData.nome : initialData.usuario.nome,
          password:
            userData.password !== ''
              ? userData.password
              : initialData.usuario.password,
          telefone:
            userData.telefone !== ''
              ? userData.telefone
              : initialData.usuario.telefone,
          username:
            userData.username !== ''
              ? userData.username
              : initialData.usuario.username,
        },
        tipos: [userData.tipos !== '' ? userData.tipos : initialData.tipos[0]],
      });
      setTimeout(() => {
        setIsLoading(false);
        setShowMsg(true);
        setMsg('Usuário alterado!');
        setSeverity('success');
        setOpenModalEdit(false);
        window.location.reload(1);
      }, '2000');
    } catch (e) {
      setIsLoading(false);
      setShowMsg(true);
      setMsg(e.response.data.error);
      setSeverity('error');
    }
  }

  return (
    <div>
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
        open={openModalEdit}
        onClose={handleClose}
        style={{
          display: 'flex',
          textAlign: 'center',
          alignSelf: 'center',
          flexDirection: 'column',
          columnCount: '3',
        }}
        fullWidth
      >
        <DialogTitle style={{ textAlign: 'center' }}>
          {initialData ? initialData.usuario.nome : ''}
        </DialogTitle>
        <div style={{ textAlign: 'center' }}>
          <TextField
            id="outlined-basic"
            label="Tipo"
            variant="outlined"
            defaultValue={initialData ? initialData.tipos : ''}
            style={{ padding: '2%' }}
            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
          />
          <TextField
            id="outlined-basic"
            label={
              initialData
                ? initialData.usuario.id !== ''
                  ? `ID - ${initialData.usuario.id}`
                  : 'ID'
                : ''
            }
            variant="outlined"
            value={userData.id}
            style={{ padding: '2%' }}
            onChange={(e) =>
              setUserData({
                ...userData,
                id: e.target.value.replace(/^\D/, ''),
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            defaultValue={initialData ? initialData.usuario.nome : ''}
            style={{ padding: '2%' }}
            onChange={(e) =>
              setUserData({
                ...userData,
                nome: e.target.value,
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            defaultValue={initialData ? initialData.usuario.email : ''}
            style={{ padding: '2%' }}
            onChange={(e) =>
              setUserData({
                ...userData,
                email: e.target.value,
              })
            }
            helperText={errorMsg.email}
            error={error.email}
            onBlur={() => onBlurEmail()}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            style={{ padding: '2%' }}
            label={
              initialData
                ? initialData.usuario.cpf !== ''
                  ? `CPF - ${initialData.usuario.cpf}`
                  : 'CPF'
                : ''
            }
            onChange={(e) =>
              setUserData({
                ...userData,

                cpf: e.target.value
                  .replace(/\D/g, '')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                  .replace(/(-\d{2})\d+?$/, '$1'),
              })
            }
            value={userData.cpf}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            style={{ padding: '2%' }}
            label={
              initialData
                ? initialData.usuario.telefone !== ''
                  ? `Telefone - ${initialData.usuario.telefone}`
                  : 'Telefone'
                : ''
            }
            value={userData.telefone}
            inputProps={{ maxLength: '15' }}
            onChange={(e) =>
              setUserData({
                ...userData,

                telefone: e.target.value
                  .replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '($1) $2')
                  .replace(/(\d{4,5})(\d{4})/, '$1-$2'),
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="Usuário"
            variant="outlined"
            defaultValue={initialData ? initialData.usuario.username : ''}
            style={{ padding: '2%' }}
            onChange={(e) =>
              setUserData({
                ...userData,
                username: e.target.value,
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="Senha"
            variant="outlined"
            defaultValue={initialData ? initialData.usuario.password : ''}
            style={{ padding: '2%' }}
            type="password"
            helperText={errorMsg.password}
            error={error.password}
            onChange={(e) => {
              if (e.target.value.length < 8) {
                setError({ ...error, password: true });
                setErrorMsg({
                  ...errorMsg,
                  password: 'Número mínimo de caracteres: 8.',
                });
              } else if (
                e.target.value.length >= 8 ||
                e.target.value.length === ''
              ) {
                setError({ ...error, password: false });
                setErrorMsg({
                  ...errorMsg,
                  password: '',
                });
              }
            }}
          />
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            style={{
              opacity: '1',
              backgroundColor: 'white',
              textAlign: 'center',
            }}
          >
            <Stack
              spacing={3}
              style={{
                width: '40%',
                margin: '10px',
                textAlign: 'center',
              }}
            >
              <DatePicker
                label="Custom input"
                value={userData.dataNascimento}
                onChange={(newValue) => onChangeDate(newValue)}
                maxDate={new Date()}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginLeft: '22vw',
                      }}
                    >
                      <Typography
                        variant="span"
                        component="span"
                        style={{
                          marginBottom: '5px',
                        }}
                      >
                        Data Nascimento <br />{' '}
                        {initialData.usuario.dataNascimento}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          ref={inputRef}
                          disabled
                          //value={date}
                          style={{ textAlign: 'center' }}
                        />
                        {InputProps?.endAdornment}
                      </Box>
                    </div>
                  </>
                )}
              />
            </Stack>
          </LocalizationProvider>
        </div>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancelar</Button>
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
            <Button onClick={() => sendData()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
