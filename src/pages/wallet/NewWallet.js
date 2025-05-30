import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import LoadingOverlay from '../../components/overlay/loading-overlay';
import { sendWriteRequest } from 'src/services/stub';

export default function NewWallet() {
  const defaultValues = {
    name: '',
    balance: '',
    iban: '',
    email: '',
    userId: AuthService.getCurrentUser()?.id,
  };

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await sendWriteRequest('POST','/wallet/create',{user_id:user.UserID})
    if(response.status === 200){
      setLoading(false);
      enqueueSnackbar('Wallet created successfully!', { variant: 'success' });
      navigate('/wallets');
    }else{
      setLoading(false);
      enqueueSnackbar('System Error. Please try again later!', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> New Wallet | e-Wallet </title>
      </Helmet>
      <LoadingOverlay open={loading} />
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            New Wallet
          </Typography>
        </Stack>
        <Card>
          <Grid container alignItems="left" justify="center" direction="column" sx={{ width: 400, padding: 5 }}>
            <Stack spacing={3}>
              <TextField
                id="name"
                name="name"
                label="Wallet Name"
                autoComplete="given-name"
                autoFocus
                required
                value={formValues.name}
                onChange={handleInputChange}
              />
              <TextField
                id="iban"
                name="iban"
                label="IBAN"
                autoComplete="iban"
                required
                value={formValues.iban}
                onChange={handleInputChange}
              />
              <TextField
                id="balance"
                name="balance"
                label="Balance"
                autoComplete="balance"
                required
                value={formValues.balance}
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
      </Container>
    </>
  );
}
