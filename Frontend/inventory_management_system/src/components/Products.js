import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BarcodeScanner from './BarcodeScanner';

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [adjustMode, setAdjustMode] = useState('add');
  const [showAdjustScanner, setShowAdjustScanner] = useState(false);
  const [adjustingStock, setAdjustingStock] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/products");
      setProductData(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/api/deleteproduct/${id}`);
        toast.success("Product deleted successfully");
        getProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product");
      }
    }
  };

  const openAdjustScanner = (mode) => {
    setAdjustMode(mode);
    setShowAdjustScanner(true);
  };

  const handleAdjustScan = async (barcode) => {
    setShowAdjustScanner(false);
    const qty = Math.max(1, Number(adjustQuantity) || 1);
    const delta = adjustMode === 'add' ? qty : -qty;

    setAdjustingStock(true);
    try {
      const response = await axios.post("http://localhost:3001/api/products/adjust-stock", {
        ProductBarcode: barcode,
        delta
      });
      toast.success(`${response.data.product.ProductName}: ${response.data.message}`);
      await getProducts();
    } catch (err) {
      console.error("Error adjusting stock:", err);
      toast.error(err.response?.data?.message || "Failed to adjust stock");
    } finally {
      setAdjustingStock(false);
    }
  };

  const handleAdjustQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setAdjustQuantity('');
      return;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 1) {
      setAdjustQuantity(numeric);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-2">
                <i className="fas fa-boxes me-2"></i>
                Products Inventory
              </h1>
              <p className="text-muted">Manage your product inventory efficiently</p>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2">
              <NavLink to="/insertproduct" className="btn btn-primary btn-lg">
                <i className="fas fa-plus me-2"></i>
                Add New Product
              </NavLink>
              <button
                type="button"
                className="btn btn-outline-success btn-lg"
                onClick={() => openAdjustScanner('add')}
                disabled={adjustingStock}
              >
                <i className="fas fa-arrow-up me-2"></i>
                Scan to Add Stock
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-lg"
                onClick={() => openAdjustScanner('remove')}
                disabled={adjustingStock}
              >
                <i className="fas fa-arrow-down me-2"></i>
                Scan to Remove Stock
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-center g-3">
                <div className="col-md-4">
                  <label htmlFor="adjustQuantity" className="form-label fw-semibold mb-0">
                    <i className="fas fa-hashtag me-2"></i>
                    Quantity per Scan
                  </label>
                  <input
                    type="number"
                    min="1"
                    id="adjustQuantity"
                    className="form-control"
                    value={adjustQuantity}
                    onChange={handleAdjustQuantityChange}
                    placeholder="1"
                  />
                  <div className="form-text">
                    Each scan will {adjustMode === 'add' ? 'add' : 'remove'} this amount.
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="alert alert-info mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Choose whether you want to increase or decrease stock, then hit “Scan”. Once the barcode is read, the stock adjusts automatically.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading products...</p>
            </div>
          ) : productData.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-box-open text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No products found</h4>
              <p className="text-muted">Start by adding your first product to the inventory.</p>
              <NavLink to="/insertproduct" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                Add First Product
              </NavLink>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-semibold">#</th>
                        <th className="border-0 fw-semibold">Product Name</th>
                        <th className="border-0 fw-semibold">Price</th>
                        <th className="border-0 fw-semibold">Stock</th>
                        <th className="border-0 fw-semibold">Barcode</th>
                        <th className="border-0 fw-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((element, id) => (
                        <tr key={element._id} className="align-middle">
                          <td className="fw-semibold text-muted">{id + 1}</td>
                          <td>
                            <div className="fw-semibold">{element.ProductName}</div>
                          </td>
                          <td>
                            <span className="badge bg-success fs-6">
                              ₹{element.ProductPrice}
                            </span>
                          </td>
                          <td>
                            <span className={`badge fs-6 ${
                              element.ProductAvailable > 10 
                                ? 'bg-success' 
                                : element.ProductAvailable > 0 
                                  ? 'bg-warning' 
                                  : 'bg-danger'
                            }`}>
                              {element.ProductAvailable}
                            </span>
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">
                              {element.ProductBarcode}
                            </code>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <NavLink 
                                to={`/updateproduct/${element._id}`} 
                                className="btn btn-outline-primary btn-sm"
                                title="Edit Product"
                              >
                                <i className="fas fa-edit"></i>
                              </NavLink>
                              <button 
                                className="btn btn-outline-danger btn-sm" 
                                onClick={() => deleteProduct(element._id)}
                                title="Delete Product"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showAdjustScanner && (
        <BarcodeScanner
          onScan={handleAdjustScan}
          onClose={() => setShowAdjustScanner(false)}
        />
      )}
    </div>
  );
}
