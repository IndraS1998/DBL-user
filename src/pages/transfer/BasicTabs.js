import { Card, Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import AddFunds from './AddFunds';
import WalletToWallet from './WalletToWallet';
import WithdrawFunds from './WithdrawFunds';
import { fetchFromRaftNode } from 'src/services/stub';
import { useSnackbar } from 'notistack';
import LoadingOverlay from 'src/components/overlay/loading-overlay';

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
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const [allWallets,setAllWallets] = React.useState([])
  const [personalWallets,setPersonalWallets] = React.useState([])
  const [allUsers,setAllUsers] = React.useState([])
  const [loading,setLoading] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar();
  
  React.useEffect(()=>{
    fetchAllUsers().then()
    fetchAllWallets().then()
    fetchPersonalWallets().then()
  },[])

  const fetchPersonalWallets = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const response = await fetchFromRaftNode(`/api/wallet/user?user_id=${user.UserID}`);
    try{
      if (response.status === 200){
        setPersonalWallets(response.data.wallets)
      }else{
        enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
      }
    }catch (error) {
      enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
    }
  };

  const fetchAllWallets = async () => {
    const response = await fetchFromRaftNode(`/api/wallet/all`);
    try{
      if (response.status === 200){
        setAllWallets(response.data.wallets)
      }else{
        enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
      }
    }catch (error) {
      enqueueSnackbar('Failed to fetch user data', { variant: 'error' });
    }
  };

  const fetchAllUsers = async () => {
    const response = await fetchFromRaftNode(`/api/admin/users`);
    console.log(response)
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Transfers | e-Wallet </title>
      </Helmet>
      <LoadingOverlay open={loading}/>
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Transfers
          </Typography>
        </Stack>
        <Card>
          <Box sx={{ width: '100%', padding: 0, pt: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Wallet to Wallet" {...a11yProps(0)} />
                <Tab label="Add Funds" {...a11yProps(1)} />
                <Tab label="Withdraw Funds" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <WalletToWallet personalWallets={personalWallets} allUsers={allUsers} allWallets={allWallets} setLoading={setLoading}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <AddFunds personalWallets={personalWallets} setLoading={setLoading}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <WithdrawFunds personalWallets={personalWallets} setLoading={setLoading}/>
            </TabPanel>
          </Box>
        </Card>
      </Container>
    </>
  );
}