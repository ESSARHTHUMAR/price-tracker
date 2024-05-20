import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodeMailer";
import { scrapeAmazonItem } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) throw new Error("No Products Found!");
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonItem(currentProduct?.url);
        if (!scrapedProduct) throw new Error("No Product Found!");
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: scrapedProduct.url,
          },
          product
        );

          const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct)
          if(emailNotifType && updatedProduct.users.length > 0){
            const productInfo = {
                title: updatedProduct.title,
                url: updatedProduct.url
            }
            const emailContent = await generateEmailBody(productInfo, emailNotifType);
            const userEmails = updatedProduct.users.map((user:any) => user.email)
            await sendEmail(emailContent, userEmails);
            }
          return updatedProduct
      })
    );
    return NextResponse.json({
        message: 'Ok', data:updatedProducts,
    })
  } catch (error) {
    console.log(error);
  }
}
