import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  currency: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  discountRate: { type: Number },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  description: { type: String },
  category: { type: String },
  numberOfReviews: { type: Number },
  rating: { type: Number },
  isOutofStock: { type: Boolean, default: false },
  users: [{ email: { type: String, required: true } }], default:[],
  feature: {type: String},
});


const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product