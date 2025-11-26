const express = require('express');
const router = express.Router();
const Products = require('../Models/Products');
const { sendOutOfStockNotification } = require('../services/emailService');

// Create (Insert) product
router.post("/insertproduct", async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode, ProductAvailable } = req.body;

  try {
    // Normalize barcode to string
    const barcodeStr = String(ProductBarcode).trim();

    const existing = await Products.findOne({ ProductBarcode: barcodeStr });
    if (existing) {
      return res.status(422).json({ message: "Product is already added." });
    }

    const addProduct = new Products({
      ProductName,
      ProductPrice,
      ProductBarcode: barcodeStr,
      ProductAvailable: Number(ProductAvailable) || 0
    });

    await addProduct.save();
    
    // Check if product is out of stock and send notification
    if (addProduct.ProductAvailable === 0) {
      await sendOutOfStockNotification(addProduct);
    }
    
    res.status(201).json(addProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const getProducts = await Products.find({});
    res.status(200).json(getProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product by id
router.get('/products/:id', async (req, res) => {
  try {
    const getProduct = await Products.findById(req.params.id);
    if (!getProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(getProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product
router.put('/updateproduct/:id', async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode, ProductAvailable } = req.body;

  try {
    const barcodeStr = String(ProductBarcode).trim();

    // If updating barcode, ensure it doesn't conflict with another product
    if (barcodeStr) {
      const conflict = await Products.findOne({ ProductBarcode: barcodeStr, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(422).json({ message: "Another product uses that barcode." });
      }
    }

    const updateFields = {
      ProductName,
      ProductPrice,
      ProductBarcode: barcodeStr,
      ProductAvailable: Number(ProductAvailable) || 0
    };

    // Get the previous product data to check if it was in stock
    const previousProduct = await Products.findById(req.params.id);
    if (!previousProduct) return res.status(404).json({ message: "Product not found" });

    const updated = await Products.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    // Check if product went out of stock (was in stock before, now is 0)
    const previousStock = previousProduct.ProductAvailable || 0;
    const newStock = Number(ProductAvailable) || 0;
    
    if (previousStock > 0 && newStock === 0) {
      await sendOutOfStockNotification(updated);
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const deleteProduct = await Products.findByIdAndDelete(req.params.id);
    if (!deleteProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(deleteProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
