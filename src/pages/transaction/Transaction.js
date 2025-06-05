import {
  Card,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { sentenceCase } from 'change-case';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import TransactionListHead from './TransactionListHead';
import { fetchFromRaftNode } from 'src/services/stub';

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false, firstColumn: true },
  { id: 'fromWallet', label: 'Sender Wallet', alignRight: false },
  { id: 'toWallet', label: 'Receiver Name (Wallet)', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: true },
  { id: 'createdAt', label: 'Time of Transaction', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function Transaction() {
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [allUsers,setAllUsers] = useState([])

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  useEffect(() => {
    fetchData();
    fetchAllUsers()
  }, []);

  const fetchData = async () => {
    const response = await fetchFromRaftNode(`/api/user/transactions?id=${user.UserID}`);
    try{
      if (response.status === 200){
        setData(response.data.operations);
      }else{
        enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
      }
    }catch (error) {
      enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
    }
  };

  const fetchAllUsers = async () => {
      const response = await fetchFromRaftNode(`/api/admin/users`);
      try{
        if (response.status === 200){
          setAllUsers(response.data.Users)
        }else{
          enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
        }
      }catch (error) {
        enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
      }
    };

  return (
    <>
      <Helmet>
        <title> Transactions | e-Transaction </title>
      </Helmet>
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            My Transactions
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TransactionListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {data &&
                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { ID, Amount, Timestamp, Wallet1, Wallet2,Wallet2Ref, Type, Status } = row;
                      const selectedRecord = selected.indexOf(ID) !== -1;
                      const date = new Date(Timestamp);
                      let receiverName = null
                      if(Wallet2 !== -1){
                        const receiver = allUsers.find(user => user.UserID === Wallet2);
                        if (receiver) {
                          receiverName = `${receiver.FirstName} ${receiver.LastName}`;
                        } else {
                          receiverName = "N/A";
                        }
                      }
                      console.log("receiver ref",Wallet2Ref)
                      return (
                        <TableRow hover key={ID} tabIndex={-1} role="checkbox" selected={selectedRecord}>
                          <TableCell align="left" sx={{ paddingLeft: 5 }}>
                            {ID}
                          </TableCell>
                          <TableCell align="left">{Wallet1}</TableCell>
                          <TableCell align="left">{receiverName} ({Wallet2 !== -1?Wallet2:"-"})</TableCell>
                          <TableCell align="right">{Amount}</TableCell>
                          <TableCell align="left">{date.toLocaleString()}</TableCell>
                          <TableCell align="left">{Type}</TableCell>
                          <TableCell align="left">
                            <Label color={Status === 'success' ? 'success' : 'warning'}>{sentenceCase(Status)}</Label>
                          </TableCell>
                          <TableCell align="right" width="20">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length > 0 ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
