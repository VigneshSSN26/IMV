import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-sm main-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <i className="fas fa-warehouse me-2"></i>
          IMS
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 main-nav">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/dashboard">
                    <i className="fas fa-chart-line me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/products">
                    <i className="fas fa-boxes me-1"></i>
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/insertproduct">
                    <i className="fas fa-plus-circle me-1"></i>
                    Add Product
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about">
                <i className="fas fa-info-circle me-1"></i>
                About
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center ms-auto">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <i className="fas fa-user-circle me-2 fs-5"></i>
                  <span className="d-none d-md-inline">{user?.name}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? 'show' : ''}`}>
                  <li>
                    <div className="dropdown-header">
                      <div className="fw-semibold">{user?.name}</div>
                      <small className="text-muted">{user?.email}</small>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
                <Link to="/register" className="btn btn-light text-primary fw-semibold">
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
