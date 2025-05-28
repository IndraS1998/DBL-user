import { useState,useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import { fetchFromRaftNode } from 'src/services/stub';
import { useSnackbar } from 'notistack';

const date = new Date();
const f = formatYearMonth(date.getFullYear(), date.getMonth());

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [walletCount,setWaletCount] = useState(0);
  const [capital,setCapital] = useState(0)
  const [transactions,setTransactions] = useState(0)
  const [transactionAmount,setTransactionsAmount] = useState(0)

  async function fetchWalletCount(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
      enqueueSnackbar('Please login to view your dashboard', { variant: 'warning' });
      return;
    }
    try {
      const response = await fetchFromRaftNode(`/api/user/stats/wallets?id=${user.UserID}`);
      if(response.status === 200){
        setWaletCount(response.data.wallets);
      }else{
        enqueueSnackbar('Failed to fetch data', { variant: 'warning' });
      }
    } catch (error) {
      enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
    }
  }

  async function fetchCapital(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
      enqueueSnackbar('Please login to view your dashboard', { variant: 'warning' });
      return;
    }
    try {
      const response = await fetchFromRaftNode(`/api/user/stats/cumulative/balance?id=${user.UserID}`);
      if(response.status === 200){
        setCapital(response.data.balance);    
      }else{
        enqueueSnackbar('Failed to fetch data', { variant: 'warning' });
      }
    } catch (error) {
      enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
    }
  }

  async function fetchTransactionsCount(){
    const user = JSON.parse(localStorage.getItem('user'));
    
    if(!user){
      enqueueSnackbar('Please login to view your dashboard', { variant: 'warning' });
      return;
    }
    try {
      const response = await fetchFromRaftNode(`/api/user/stats/transactions/count?id=${user.UserID}&month=${f}`);
      if (response.status === 200){
        setTransactions(response.data.transactions);
      }else{
        enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
    }
  }

  async function fetchTransactionsSum(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
      enqueueSnackbar('Please login to view your dashboard', { variant: 'warning' });
      return;
    }
    try {
      const response = await fetchFromRaftNode(`/api/user/stats/transaction/sum?id=${user.UserID}&month=${f}`);
      if ( response.status === 200){
        setTransactionsAmount(response.data.sum);
      }else{
        enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
    }
  }

  useEffect(()=>{
    fetchWalletCount().then();
    fetchCapital().then();
    fetchTransactionsCount().then();
    fetchTransactionsSum().then();
  },[])

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Wallets" total={walletCount} icon={'ant-design:wallet-outlined'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Capital" total={capital} color="warning" icon={'ant-design:user-outlined'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total monthly transactions"
              total={transactions}
              color="info"
              icon={'ant-design:transaction-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Monthly transactions Worth"
              total={transactionAmount}
              color="error"
              icon={'ant-design:euro-outlined'}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function formatYearMonth(year, month) {
  // month is 0-based, so add 1 and pad with leading zero if needed
  const mm = String(month + 1).padStart(2, '0')
  return `${year}-${mm}`
}