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

export default function ModalAdd({ openModalAdd, setOpenModalAdd }) {
	/* const handleClickOpen = () => {
		setOpen(true);
	}; */

	const handleClose = () => {
		setOpenModalAdd(false);
	};

	return (
		<div style={{ display: 'flex', textAlign: 'center' }}>
			<Dialog
				open={openModalAdd}
				onClose={handleClose}
				style={{ textAlign: 'center', alignSelf: 'center' }}
				fullWidth
			>
				<DialogTitle>{}</DialogTitle>
				<div>
					<TextField id="outlined-basic" label="ID" variant="outlined" />
					<TextField id="outlined-basic" label="Nome" variant="outlined" />
					<TextField id="outlined-basic" label="E-mail" variant="outlined" />
					<TextField id="outlined-basic" label="CPF" variant="outlined" />
					<TextField id="outlined-basic" label="Telefone" variant="outlined" />
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
