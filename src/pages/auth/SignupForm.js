import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField,Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import LoadingOverlay from 'src/components/overlay/loading-overlay';
import { sendWriteRequest } from 'src/services/stub';
import { v4 as uuidv4 } from 'uuid';


export default function SignupForm() {
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: null,
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(defaultValues);
  const [errors,setErrors] = useState({passwordMatch:false})
  const [loading,setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      if (name === 'dob') {
      const date = new Date(value);
      const isoString = date.toISOString(); // Converts to "2023-12-25T15:04:05Z" format
      setFormValues({
        ...formValues,
        [name]: isoString,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
     // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setErrors({
        ...errors,
        passwordMatch: formValues.password !== value && name === 'confirmPassword'
      });
    }
  };

  const handleSubmit = async (event) => {
    if( formValues.password !== formValues.confirmPassword){
      return
    }
    setLoading(true)
    event.preventDefault();
    try{
      const r = await sendWriteRequest('POST','/user/signup',{
        first_name:formValues.firstName,
        last_name:formValues.lastName,
        password:formValues.password,
        email:formValues.email,
        id_number: uuidv4(),
        id_image_front: uuidv4(),
        id_image_back:uuidv4(),
        dob:formValues.dob,
      })
      if(r.status === 200){
        enqueueSnackbar('Signed up successfully', { variant: 'success' });
        navigate('/login');
      }else{
        enqueueSnackbar("Failure to create user!", { variant: 'error' });
      }
    }catch(e){
      enqueueSnackbar("Network error!", { variant: 'error' });
    }
    setLoading(false)
  };

  return (
    <>
      <LoadingOverlay open={loading}/>
      <Stack spacing={3}>
        <TextField
          id="firstName"
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          autoFocus
          required
          value={formValues.firstName}
          onChange={handleInputChange}
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Last Name"
          autoComplete="lastName"
          required
          value={formValues.lastName}
          onChange={handleInputChange}
        />
        <TextField
          id="email"
          name="email"
          label="email"
          autoComplete="email"
          required
          value={formValues.email}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          name="dob"
          value={formValues.dob}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            max: new Date().toISOString().split("T")[0], // Max = today
          }}
          required
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
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="confirmPassword"
          autoComplete="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          required
          value={formValues.confirmPassword}
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
        {errors.passwordMatch && (
          <Typography color="error" variant="caption">
            Passwords do not match
          </Typography>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Sign up
      </LoadingButton>
    </>
  );
}