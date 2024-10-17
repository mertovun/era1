import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  console.log(user);

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link className="nav-link" to="/">Home</Link>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-link">Welcome, {user.username}</span>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
