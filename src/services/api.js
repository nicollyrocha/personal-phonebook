import axios from 'axios';

export default axios.create({
  baseURL: 'https://metawaydemo.vps-kinghost.net:8485',
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, },
});
