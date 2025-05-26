import axios from './axios';

const login = (body) => {
  //const url = '/auth/login';
  const user = {
    id:1, first_name:'John', last_name:'Doe', username:'johnDoe', email:'johndoe@gmail.com',password:"password"
  }
  localStorage.setItem('user', JSON.stringify(user));
  return true
  /*
  return axios.post(url, body).then((response) => {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data;
  });*/
};

const signup = (body) => {
  const url = '/auth/signup';
  return axios.post(url, body).then((response) => response.data);
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

const AuthService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default AuthService;
