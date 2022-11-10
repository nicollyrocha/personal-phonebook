import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';

export default function TableContatos({
	rows,
	setUserSelected,
	setOpenModalDelete,
	setOpenModalEdit,
	setOpenModalFavorite,
}) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	function onClickOpenModalDelete(row) {
		setOpenModalDelete(true);
	}

	function onClickOpenModalEdit(row) {
		setOpenModalEdit(true);
	}

	function onClickOpenModalFavorite(row) {
		setOpenModalFavorite(true);
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table
					stickyHeader
					aria-label="sticky table"
					sx={{
						boxShadow: 2,
						border: 2,
						borderColor: 'primary.light',
						'& .MuiDataGrid-cell': {
							justifyContent: 'center',
						},
						'& .MuiDataGrid-columnHeaderTitleContainer': {
							justifyContent: 'center',
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							></TableCell>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							>
								Nome
							</TableCell>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							>
								Tipo
							</TableCell>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							>
								E-mail
							</TableCell>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							>
								Telefone
							</TableCell>
							<TableCell
								align="center"
								style={{ fontWeight: 700 }}
							>
								Tag
							</TableCell>
							<TableCell
								align="right"
								style={{ fontWeight: 700 }}
							></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								<TableCell style={{ marginLeft: '5vw', width: '2vw' }}>
									<Avatar>{row.pessoa.nome.toUpperCase()[0]}</Avatar>
								</TableCell>
								<TableCell align="center">{row.pessoa.nome}</TableCell>
								<TableCell align="center">{row.tipoContato}</TableCell>
								<TableCell align="center">{row.email}</TableCell>
								<TableCell align="center">{row.telefone}</TableCell>
								<TableCell align="center">{row.tag}</TableCell>
								<TableCell align="center">
									{
										<>
											<IconButton
												aria-label="delete"
												onClick={() => (
													setUserSelected(row), onClickOpenModalDelete(row)
												)}
											>
												<DeleteIcon />
											</IconButton>
											<IconButton
												aria-label="edit"
												onClick={() => (
													setUserSelected(row), onClickOpenModalEdit(row)
												)}
											>
												<EditIcon />
											</IconButton>
										</>
									}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
