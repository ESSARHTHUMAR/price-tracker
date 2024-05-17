"use server";

import { connectToDB } from "../mongoose";
import { scrapeAmazonItem } from "../scraper";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreItem(productUrl: string) {
  if (!productUrl) return;

  try {
    const scrapedItem = await scrapeAmazonItem(productUrl);

    if (!scrapedItem) return;

    connectToDB();

    let product = scrapedItem;
    const existingItem = await Product.findOne({ url: scrapedItem.url });

    if (existingItem) {
      const updatePriceHistory: any = [
        ...existingItem.priceHistory,
        { price: scrapedItem.currentPrice },
      ];

      product = {
        ...scrapedItem,
        priceHistory: updatePriceHistory,
        lowestPrice: getLowestPrice(updatePriceHistory),
        highestPrice: getHighestPrice(updatePriceHistory),
        averagePrice: getAveragePrice(updatePriceHistory),
      };
    }

    const newItem = await Product.findOneAndUpdate(
      { url: scrapedItem.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newItem._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create the product: ${error.message}`);
  }
}

export async function getItemById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {

  try {
    connectToDB();
  
    const allProducts = await Product.find();
  
    return allProducts
    
  } catch (error) {
    console.log(error);
    
  }
}

export async function getSimiliarProducts(productId: string){

  try {
    connectToDB();
  
    const currentProduct = await Product.findById(productId);
  
    if (!currentProduct) return null;

    const similiarProducts = await Product.find({
      _id:{$ne: productId},

    }).limit(3)

    return similiarProducts;
    
  } catch (error) {
    console.log(error);    
  }


}