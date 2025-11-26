import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/analytics");
      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  const { summary, stockDistribution, priceRanges, recentProducts, lowStockProducts, outOfStockProducts } = analytics;

  // Calculate percentages for stock distribution
  const totalForPercentage = stockDistribution.outOfStock + stockDistribution.lowStock + stockDistribution.inStock;
  const outOfStockPercent = totalForPercentage > 0 ? ((stockDistribution.outOfStock / totalForPercentage) * 100).toFixed(1) : 0;
  const lowStockPercent = totalForPercentage > 0 ? ((stockDistribution.lowStock / totalForPercentage) * 100).toFixed(1) : 0;
  const inStockPercent = totalForPercentage > 0 ? ((stockDistribution.inStock / totalForPercentage) * 100).toFixed(1) : 0;

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold text-primary mb-2">
                <i className="fas fa-chart-line me-2"></i>
                Analysis Dashboard
              </h1>
              <p className="text-muted">Comprehensive overview of your inventory</p>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={fetchAnalytics}
              title="Refresh Data"
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <i className="fas fa-boxes text-primary fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small mb-1">Total Products</div>
                  <div className="h4 mb-0 fw-bold text-primary">{summary.totalProducts}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <i className="fas fa-rupee-sign text-success fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small mb-1">Inventory Value</div>
                  <div className="h4 mb-0 fw-bold text-success">{formatCurrency(summary.totalInventoryValue)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <i className="fas fa-layer-group text-info fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small mb-1">Total Stock Units</div>
                  <div className="h4 mb-0 fw-bold text-info">{summary.totalStockQuantity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <i className="fas fa-tag text-warning fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small mb-1">Average Price</div>
                  <div className="h4 mb-0 fw-bold text-warning">{formatCurrency(summary.averagePrice)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Status Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  In Stock
                </h5>
                <span className="badge bg-success fs-6">{summary.inStockCount}</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${inStockPercent}%` }}
                  aria-valuenow={inStockPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <small className="text-muted mt-2 d-block">{inStockPercent}% of products</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                  Low Stock
                </h5>
                <span className="badge bg-warning fs-6">{summary.lowStockCount}</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${lowStockPercent}%` }}
                  aria-valuenow={lowStockPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <small className="text-muted mt-2 d-block">{lowStockPercent}% of products</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-times-circle text-danger me-2"></i>
                  Out of Stock
                </h5>
                <span className="badge bg-danger fs-6">{summary.outOfStockCount}</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${outOfStockPercent}%` }}
                  aria-valuenow={outOfStockPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <small className="text-muted mt-2 d-block">{outOfStockPercent}% of products</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Products */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2 text-primary"></i>
                Recent Products
              </h5>
            </div>
            <div className="card-body">
              {recentProducts.length === 0 ? (
                <p className="text-muted text-center py-3">No recent products</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((product) => (
                        <tr key={product._id}>
                          <td className="fw-semibold">{product.ProductName}</td>
                          <td>{formatCurrency(product.ProductPrice)}</td>
                          <td>
                            <span className={`badge ${
                              product.ProductAvailable > 10 ? 'bg-success' : 
                              product.ProductAvailable > 0 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {product.ProductAvailable}
                            </span>
                          </td>
                          <td className="text-muted small">{formatDate(product.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                Low Stock Products
              </h5>
            </div>
            <div className="card-body">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted text-center py-3">No low stock products</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Barcode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={product._id}>
                          <td className="fw-semibold">{product.ProductName}</td>
                          <td>{formatCurrency(product.ProductPrice)}</td>
                          <td>
                            <span className="badge bg-warning">{product.ProductAvailable}</span>
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">{product.ProductBarcode}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Out of Stock Products */}
      {outOfStockProducts.length > 0 && (
        <div className="row g-4 mt-2">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-danger bg-opacity-10 border-bottom">
                <h5 className="mb-0 text-danger">
                  <i className="fas fa-times-circle me-2"></i>
                  Out of Stock Products ({outOfStockProducts.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Barcode</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outOfStockProducts.map((product) => (
                        <tr key={product._id}>
                          <td className="fw-semibold">{product.ProductName}</td>
                          <td>{formatCurrency(product.ProductPrice)}</td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">{product.ProductBarcode}</code>
                          </td>
                          <td>
                            <NavLink
                              to={`/updateproduct/${product._id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="fas fa-edit me-1"></i>
                              Restock
                            </NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Range Distribution */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2 text-primary"></i>
                Price Range Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1 text-primary">{priceRanges.under50}</div>
                    <div className="text-muted small">Under ₹50</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1 text-info">{priceRanges.between50and200}</div>
                    <div className="text-muted small">₹50 - ₹200</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1 text-warning">{priceRanges.between200and500}</div>
                    <div className="text-muted small">₹200 - ₹500</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1 text-success">{priceRanges.over500}</div>
                    <div className="text-muted small">Over ₹500</div>
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

