import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { fetchFromRaftNode } from 'src/services/stub';

export default function LoginForm() {
  const defaultValues = {
    username: 'johndoe',
    password: 'johnd@e',
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const res = await fetchFromRaftNode(`/api/user/sign-in?email=${formValues.username}&password=${formValues.password}`);
    
    if(!res){
      enqueueSnackbar('Network Error. Please try again later!', { variant: 'error' });
    }
    if(res.status === 200){
      localStorage.clear()
      localStorage.setItem('user', JSON.stringify(res.data.user));
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    }else{
      enqueueSnackbar('invalid credentials.', { variant: 'error' });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          id="username"
          name="username"
          label="Username"
          autoComplete="username"
          required
          autoFocus
          value={formValues.username}
          onChange={handleInputChange}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          required
          value={formValues.password}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Log in
      </LoadingButton>
    </>
  );
}
