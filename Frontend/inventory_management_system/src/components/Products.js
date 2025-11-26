import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <NavLink to="/insertproduct" className="btn btn-primary btn-lg">
              <i className="fas fa-plus me-2"></i>
              Add New Product
            </NavLink>
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
                              ${element.ProductPrice}
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
    </div>
  );
}
