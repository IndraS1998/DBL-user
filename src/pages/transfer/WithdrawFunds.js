import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Grid, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { sendWriteRequest } from 'src/services/stub';

export default function WithdrawFunds({personalWallets,setLoading}) {
  const defaultValues = {
    amount: '',
    fromWalletIban: '',
    toWalletIban: '',
    description: '',
    typeId: 1, // set as Transfer by default
  };

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(defaultValues);
  const [toWalletIbans, setFromWalletIbans] = useState([]);
  const [toWalletIban, setFromWalletIban] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleWalletChange = (newValue) => {
    setFromWalletIban(newValue);
    const selectedWallet = personalWallets.find(w => w.WalletID === newValue)
    console.log(selectedWallet)
    setFormValues({
      ...formValues,
      fromWalletIban: newValue,
      toWalletIban: newValue,
      description:selectedWallet.Balance
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    try{
      const response = await sendWriteRequest('POST','/wallet/withdraw',{
        sender_wallet_id:formValues.fromWalletIban,
        amount:Number(formValues.amount)
      })
      if(response.status === 200){
        enqueueSnackbar('Successful operation!', { variant: 'success' });
      }else if(response.status === 300){
        enqueueSnackbar('Failed to perform operation', { variant: 'error' });
      }else{
        enqueueSnackbar('Failed to perform operation', { variant: 'error' });
      }
    }catch(e){
      enqueueSnackbar('Network error', { variant: 'error' });
    }
    
    setLoading(false)
  };

  return (
    <>
      <Helmet>
        <title> Withdraw Funds | e-Wallet </title>
      </Helmet>
      <Card>
        <Grid container alignItems="left" justify="left" direction="column" sx={{ width: 400, padding: 5 }}>
          <Stack spacing={3}>
            <TextField
              id="amount"
              name="amount"
              label="Amount"
              autoFocus
              required
              value={formValues.amount}
              onChange={handleInputChange}
            />
            <Autocomplete
              ListboxProps={{ style: { maxHeight: 200, overflow: 'auto' } }}
              required
              disablePortal
              id="toWalletIban"
              noOptionsText="no records"
              options={personalWallets.map(wallet => wallet.WalletID)}
              getOptionLabel={(walletId) => walletId}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(event, newValue) => {
                handleWalletChange(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Receiver Wallet" />}
            />
            <TextField
              id="description"
              name="description"
              label="Selected wallet balance"
              autoComplete="description"
              required
              value={formValues.description}
              onChange={handleInputChange}
            />
          </Stack>
          <Stack spacing={2} direction="row" alignItems="right" justifyContent="end" sx={{ mt: 4 }}>
            <Button sx={{ width: 120 }} variant="outlined" onClick={() => navigate('/wallets')}>
              Cancel
            </Button>
            <LoadingButton sx={{ width: 120 }} size="large" type="submit" variant="contained" onClick={handleSubmit}>
              Save
            </LoadingButton>
          </Stack>
        </Grid>
      </Card>
    </>
  );
}
