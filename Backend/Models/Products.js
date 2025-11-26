const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  ProductBarcode: {
    type: String, // use string to preserve leading zeros and support maxLength
    required: true,
    unique: true,
  },
  ProductAvailable: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
