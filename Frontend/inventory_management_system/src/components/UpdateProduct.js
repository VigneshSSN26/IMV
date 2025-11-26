import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BarcodeScanner from './BarcodeScanner';

export default function UpdateProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productBarcode: "",
    productAvailable: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        const data = response.data;
        
        setFormData({
          productName: data.ProductName,
          productPrice: data.ProductPrice,
          productBarcode: data.ProductBarcode,
          productAvailable: data.ProductAvailable ?? 0
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product data");
        navigate('/products');
      } finally {
        setInitialLoading(false);
      }
    };

    getProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productBarcode') {
      setFormData({
        ...formData,
        [name]: value.slice(0, 12)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.productPrice || !formData.productBarcode) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.put(`http://localhost:3001/api/updateproduct/${id}`, {
        ProductName: formData.productName,
        ProductPrice: Number(formData.productPrice),
        ProductBarcode: formData.productBarcode,
        ProductAvailable: Number(formData.productAvailable)
      });

      toast.success("Product updated successfully!");
      navigate('/products');
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = (barcode) => {
    setFormData({
      ...formData,
      productBarcode: barcode.slice(0, 12) // Limit to 12 characters
    });
    setShowScanner(false);
    toast.success(`Barcode scanned: ${barcode}`);
  };

  if (initialLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-4">
              <div className="text-center">
                <h1 className="fw-bold text-primary mb-2">
                  <i className="fas fa-edit me-2"></i>
                  Update Product
                </h1>
                <p className="text-muted">Modify the product information below</p>
              </div>
            </div>
            <div className="card-body p-5">
              <form onSubmit={updateProduct}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label htmlFor="productName" className="form-label fw-semibold">
                      <i className="fas fa-tag me-1"></i>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2 rounded-3"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="productPrice" className="form-label fw-semibold">
                      <i className="fas fa-rupee-sign me-1"></i>
                      Product Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control form-control-lg border-2 rounded-3"
                      id="productPrice"
                      name="productPrice"
                      value={formData.productPrice}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="productBarcode" className="form-label fw-semibold">
                      <i className="fas fa-barcode me-1"></i>
                      Product Barcode *
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        maxLength={12}
                        className="form-control form-control-lg border-2 rounded-3"
                        id="productBarcode"
                        name="productBarcode"
                        value={formData.productBarcode}
                        onChange={handleChange}
                        required
                        placeholder="Enter 12-digit barcode or scan"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-lg"
                        onClick={() => setShowScanner(true)}
                        title="Scan barcode with camera"
                      >
                        <i className="fas fa-camera me-2"></i>
                        Scan
                      </button>
                    </div>
                    <div className="form-text">Maximum 12 characters</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="productAvailable" className="form-label fw-semibold">
                      <i className="fas fa-boxes me-1"></i>
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-lg border-2 rounded-3"
                      id="productAvailable"
                      name="productAvailable"
                      value={formData.productAvailable}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-center mt-5">
                  <NavLink to="/products" className="btn btn-outline-secondary btn-lg px-4">
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </NavLink>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
