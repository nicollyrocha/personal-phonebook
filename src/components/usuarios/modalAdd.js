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
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ModalAdd({ openModalAdd, setOpenModalAdd }) {
  const [cpf, setCpf] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [user, setUser] = React.useState('');
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState({
    email: '',
    password: '',
    number: '',
    cpf: '',
  });
  const [error, setError] = React.useState({
    email: false,
    password: false,
    number: false,
    cpf: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMsg, setShowMsg] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [severity, setSeverity] = React.useState('');

  const handleClose = () => {
    setOpenModalAdd(false);
  };

  function onBlurEmail(e) {
    const emailValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
    if (email.length === 0 || emailValid === true) {
      setEmail(email);

      setError({ ...error, email: false });
      setErrorMsg({ ...errorMsg, email: '' });
    } else {
      setError({ ...error, email: true });
      setErrorMsg({ ...errorMsg, email: 'Insira um e-mail válido.' });
    }
  }

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
        open={openModalAdd}
        onClose={handleClose}
        style={{ textAlign: 'center', alignSelf: 'center' }}
        fullWidth
      >
        <DialogTitle>{}</DialogTitle>
        <div>
          <TextField
            id="outlined-basic"
            onChange={(e) =>
              e.target.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
            }
            label="ID"
            variant="outlined"
          />
          <TextField id="outlined-basic" label="Nome" variant="outlined" />
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => onBlurEmail(e)}
          />
          <TextField id="outlined-basic" label="CPF" variant="outlined" />
          <TextField
            id="outlined-basic"
            label="Telefone"
            variant="outlined"
            onChange={(e) =>
              setNumber(
                e.target.value
                  .replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '($1) $2')
                  .replace(/(\d{4,5})(\d{4})/, '$1-$2')
              )
            }
          />
          <TextField id="outlined-basic" label="Usuário" variant="outlined" />
        </div>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          style={{
            opacity: '1',
            backgroundColor: 'white',
            textAlign: 'center',
            alignSelf: 'center',
          }}
        >
          <Stack
            spacing={3}
            style={{
              display: 'flex',
              width: '40%',
              margin: '10px',
              textAlign: 'center',
              alignSelf: 'center',
            }}
          >
            <DatePicker
              label="Custom input"
              //value={date}
              //onChange={(newValue) => onChangeDate(newValue)}
              maxDate={new Date()}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <>
                  <div
                    style={{
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <Typography
                      variant="span"
                      component="span"
                      style={{
                        marginBottom: '5px',
                      }}
                    >
                      Data Nascimento
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
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancelar</Button>
          <Button>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
