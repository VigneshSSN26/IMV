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

// Adjust product stock by barcode (increment/decrement)
router.post('/products/adjust-stock', async (req, res) => {
  const { ProductBarcode, delta } = req.body;

  if (typeof ProductBarcode === 'undefined' || ProductBarcode === null || ProductBarcode === '') {
    return res.status(400).json({ message: "ProductBarcode is required" });
  }

  const deltaValue = Number(delta);
  if (!Number.isFinite(deltaValue) || deltaValue === 0) {
    return res.status(400).json({ message: "Delta must be a non-zero number" });
  }

  try {
    const barcodeStr = String(ProductBarcode).trim();
    const product = await Products.findOne({ ProductBarcode: barcodeStr });

    if (!product) {
      return res.status(404).json({ message: "Product with that barcode was not found" });
    }

    const previousStock = product.ProductAvailable || 0;
    const newStock = Math.max(previousStock + deltaValue, 0);

    product.ProductAvailable = newStock;
    await product.save();

    if (previousStock > 0 && newStock === 0) {
      await sendOutOfStockNotification(product);
    }

    res.status(200).json({
      message: deltaValue > 0 ? "Stock increased successfully" : "Stock decreased successfully",
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Analytics/Dashboard endpoint
router.get('/analytics', async (req, res) => {
  try {
    const allProducts = await Products.find({});
    
    // Calculate statistics
    const totalProducts = allProducts.length;
    const totalInventoryValue = allProducts.reduce((sum, product) => {
      return sum + (product.ProductPrice * product.ProductAvailable);
    }, 0);
    
    const totalStockQuantity = allProducts.reduce((sum, product) => {
      return sum + product.ProductAvailable;
    }, 0);
    
    const outOfStockCount = allProducts.filter(p => p.ProductAvailable === 0).length;
    const lowStockCount = allProducts.filter(p => p.ProductAvailable > 0 && p.ProductAvailable <= 10).length;
    const inStockCount = allProducts.filter(p => p.ProductAvailable > 10).length;
    
    const averagePrice = totalProducts > 0 
      ? allProducts.reduce((sum, p) => sum + p.ProductPrice, 0) / totalProducts 
      : 0;
    
    // Get recent products (last 5)
    const recentProducts = await Products.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('ProductName ProductPrice ProductAvailable createdAt');
    
    // Get low stock products (1-10)
    const lowStockProducts = await Products.find({
      ProductAvailable: { $gt: 0, $lte: 10 }
    })
      .sort({ ProductAvailable: 1 })
      .limit(10)
      .select('ProductName ProductPrice ProductAvailable ProductBarcode');
    
    // Get out of stock products
    const outOfStockProducts = await Products.find({
      ProductAvailable: 0
    })
      .sort({ ProductName: 1 })
      .select('ProductName ProductPrice ProductBarcode');
    
    // Stock distribution by ranges
    const stockDistribution = {
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
      inStock: inStockCount
    };
    
    // Price range distribution
    const priceRanges = {
      under50: allProducts.filter(p => p.ProductPrice < 50).length,
      between50and200: allProducts.filter(p => p.ProductPrice >= 50 && p.ProductPrice < 200).length,
      between200and500: allProducts.filter(p => p.ProductPrice >= 200 && p.ProductPrice < 500).length,
      over500: allProducts.filter(p => p.ProductPrice >= 500).length
    };
    
    res.status(200).json({
      summary: {
        totalProducts,
        totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
        totalStockQuantity,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        outOfStockCount,
        lowStockCount,
        inStockCount
      },
      stockDistribution,
      priceRanges,
      recentProducts,
      lowStockProducts,
      outOfStockProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
