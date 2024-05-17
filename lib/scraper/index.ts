import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonItem(url: string) {
  if (!url) return;

  const username = String(process.env.BRIGHTDATA_PROXY_USERNAME);
  const password = String(process.env.BRIGHTDATA_PROXY_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base')
    );
    
    const originalPrice = extractPrice(
        $('.basisPrice span.a-price span.a-offscreen'),
      );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === "currently unavailable";
    const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}'
    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($('.a-price-symbol'))
    const discountPercentage = $('.savingsPercentage').text().replace(/[-%]/g, "")
    const category = $('#wayfinding-breadcrumbs_feature_div ul li:nth-child(1) span a').text().trim()
    const rating = $('#acrPopover span.a-declarative a span.a-size-base').text()
    const numberOfReviews = $('#acrCustomerReviewText').text().replace(/[^\d-ratings]/g, "");
    const description = extractDescription($)
    const feature = $('#brandSnapshot_feature_div div div.a-cardui.brand-snapshot-card-container div div div.a-section.brand-snapshot-flex-badges-section div:nth-child(2) p').text().trim()     
    const data = {
      url,
      title,
      currency,
      image: imageUrls[0],
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountPercentage: Number(discountPercentage),
      category,
      numberOfReviews: parseInt(numberOfReviews),
      rating: parseFloat(rating),
      isOutofStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      feature: feature
    }

    return data;    

  } catch (error: any) {
    throw new Error(`Failed to scrape the item: ${error.message}`);
  }
}
