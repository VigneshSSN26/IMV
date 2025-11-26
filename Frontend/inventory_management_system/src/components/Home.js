import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-primary text-white" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Inventory Management System
              </h1>
              <p className="lead mb-4 fs-5">
                A secure and intuitive system for managing your business inventory. 
                Track products, manage stock levels, and optimize your operations.
              </p>
              
              {isAuthenticated ? (
                <div className="d-flex gap-3 mb-4">
                  <Link to="/products" className="btn btn-warning btn-lg px-4 py-3">
                    <i className="fas fa-boxes me-2"></i>
                    View Products
                  </Link>
                  <Link to="/insertproduct" className="btn btn-outline-light btn-lg px-4 py-3">
                    <i className="fas fa-plus me-2"></i>
                    Add Product
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-3 mb-4">
                  <Link to="/register" className="btn btn-warning btn-lg px-4 py-3">
                    <i className="fas fa-user-plus me-2"></i>
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </Link>
                </div>
              )}
            </div>
            
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 d-inline-block">
                <i className="fas fa-warehouse text-white" style={{ fontSize: '6rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <div className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <i className="fas fa-user-check text-success" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h3 className="fw-bold mb-3">Welcome back, {user?.name}!</h3>
                    <p className="text-muted mb-4">
                      You're successfully logged in. Start managing your inventory now.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                      <Link to="/products" className="btn btn-success btn-lg">
                        <i className="fas fa-boxes me-2"></i>
                        View All Products
                      </Link>
                      <Link to="/insertproduct" className="btn btn-info btn-lg">
                        <i className="fas fa-plus me-2"></i>
                        Add New Product
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="py-4 bg-white border-top">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <h4 className="fw-bold text-primary mb-1">1000+</h4>
              <p className="text-muted mb-0 small">Active Users</p>
            </div>
            <div className="col-md-4">
              <h4 className="fw-bold text-success mb-1">50K+</h4>
              <p className="text-muted mb-0 small">Products Managed</p>
            </div>
            <div className="col-md-4">
              <h4 className="fw-bold text-info mb-1">99.9%</h4>
              <p className="text-muted mb-0 small">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
