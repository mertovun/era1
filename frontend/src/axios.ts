import axios from 'axios';

export const userService = axios.create({
  baseURL: 'http://localhost:3001', 
  withCredentials: true, 
});

export const eventService = axios.create({
  baseURL: 'http://localhost:3002', 
  withCredentials: true, 
});