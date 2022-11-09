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
import api from '../../services/api';
import ModalEdit from './modalEdit';

export default function TableUsuarios({
  rows,
  setOpenModalEdit,
  openModalEdit,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userSelected, setUserSelected] = React.useState();
  const [initialData, setInitialData] = React.useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function onClickOpenModalEdit(row) {
    setOpenModalEdit(true);
  }

  async function getUserData(row) {
    try {
      const user = await api.get(`api/usuario/buscar/${row.id}`);

      setInitialData(user.data.object);
      setOpenModalEdit(true);
    } catch (e) {}
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ModalEdit
        openModalEdit={openModalEdit}
        setOpenModalEdit={setOpenModalEdit}
        userSelected={userSelected}
        initialData={initialData}
        setInitialData={setInitialData}
      />
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
              <TableCell align="center" style={{ fontWeight: 700 }}>
                ID
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Nome
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Data Nascimento
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                CPF
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                E-mail
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Telefone
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Username
              </TableCell>
              <TableCell align="right" style={{ fontWeight: 700 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.nome}</TableCell>
                <TableCell align="center">{row.dataNascimento}</TableCell>
                <TableCell align="center">{row.cpf}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.telefone}</TableCell>
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">
                  {
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => getUserData(row)}
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
