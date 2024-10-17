import React from 'react';
import ReactDOM from 'react-dom/client';
import EventFeed from './pages/EventFeed';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import NewEvent from './pages/NewEvent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthProvider>
  <Router>
    <Header/>
    <Routes>
      <Route path="/" element={<EventFeed />} />
      <Route path="/new" element={<NewEvent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
  </AuthProvider>

);