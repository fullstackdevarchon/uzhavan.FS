import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  { name: "Spices", limit: 10 },
  { name: "Vegetables", limit: 10 },
  { name: "Fruits", limit: 10 }
];

async function initCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { $setOnInsert: cat },
        { upsert: true, new: true }
      );
    }

    console.log('Categories initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initCategories();