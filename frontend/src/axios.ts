import axios from 'axios';

export const userService = axios.create({
  baseURL: process.env.REACT_APP_USER_SERVICE_URL, 
  withCredentials: true, 
});

export const eventService = axios.create({
  baseURL: process.env.REACT_APP_EVENT_SERVICE_URL, 
  withCredentials: true, 
});
