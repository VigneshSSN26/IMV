import React from 'react';

export default function About() {
  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <div className="bg-gradient text-white py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                <i className="fas fa-warehouse me-3"></i>
                Inventory Management System
              </h1>
              <p className="lead mb-4">
                A modern, secure, and efficient MERN stack application for managing your business inventory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="fw-bold text-primary mb-4">About This Application</h2>
                  
                  <p className="lead mb-4">
                    This Inventory Management System is a full-stack web application built with the MERN stack 
                    (MongoDB, Express.js, React.js, and Node.js) that provides a comprehensive solution for 
                    managing product inventory with modern security features.
                  </p>

                  <h3 className="fw-bold mb-3">Key Features</h3>
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-shield-alt text-primary"></i>
                        </div>
                        <div>
                          <h5 className="fw-semibold mb-1">Secure Authentication</h5>
                          <p className="text-muted small">JWT-based authentication with encrypted password storage using bcrypt</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-boxes text-success"></i>
                        </div>
                        <div>
                          <h5 className="fw-semibold mb-1">Product Management</h5>
                          <p className="text-muted small">Complete CRUD operations for product inventory management</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-barcode text-info"></i>
                        </div>
                        <div>
                          <h5 className="fw-semibold mb-1">Barcode Support</h5>
                          <p className="text-muted small">Unique barcode tracking for each product with validation</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-mobile-alt text-warning"></i>
                        </div>
                        <div>
                          <h5 className="fw-semibold mb-1">Responsive Design</h5>
                          <p className="text-muted small">Modern, mobile-friendly interface with Bootstrap 5</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="fw-bold mb-3">Technology Stack</h3>
                  <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                      <div className="text-center p-3 border rounded-3">
                        <i className="fab fa-react text-primary fs-2 mb-2"></i>
                        <h6 className="fw-semibold">React.js</h6>
                        <small className="text-muted">Frontend Framework</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-3 border rounded-3">
                        <i className="fab fa-node-js text-success fs-2 mb-2"></i>
                        <h6 className="fw-semibold">Node.js</h6>
                        <small className="text-muted">Backend Runtime</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-3 border rounded-3">
                        <i className="fas fa-database text-info fs-2 mb-2"></i>
                        <h6 className="fw-semibold">MongoDB</h6>
                        <small className="text-muted">Database</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-3 border rounded-3">
                        <i className="fas fa-server text-warning fs-2 mb-2"></i>
                        <h6 className="fw-semibold">Express.js</h6>
                        <small className="text-muted">Web Framework</small>
                      </div>
                    </div>
                  </div>

                  <h3 className="fw-bold mb-3">Security Features</h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <strong>Password Encryption:</strong> All passwords are hashed using bcrypt with salt rounds
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <strong>JWT Authentication:</strong> Secure token-based authentication system
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <strong>Protected Routes:</strong> Authentication required for sensitive operations
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <strong>Input Validation:</strong> Server-side validation for all user inputs
                    </li>
                  </ul>

                  <div className="text-center mt-5">
                    <h4 className="fw-bold mb-3">Ready to Get Started?</h4>
                    <p className="text-muted mb-4">
                      Create an account and start managing your inventory efficiently
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                      <a href="/register" className="btn btn-primary btn-lg">
                        <i className="fas fa-user-plus me-2"></i>
                        Sign Up Now
                      </a>
                      <a href="/login" className="btn btn-outline-primary btn-lg">
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
