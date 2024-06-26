import Modal from "@/app/components/Modal";
import PriceInfoCard from "@/app/components/PriceInfoCard";
import ProductCard from "@/app/components/ProductCard";
import { getItemById, getSimiliarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

const ProductDetailsPage = async ({ params: { id } }: Props) => {
  const product = await getItemById(id);
  const similiarProducts = await getSimiliarProducts(id)

  if (!product) redirect("/");

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product?.numberOfReviews}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10 ">
                <Image
                  src="/assets/icons/bookmark.svg"
                  width={20}
                  height={20}
                  alt="save"
                />
              </div>

              <div className="p-2 bg-white-200 rounded-10 ">
                <Image
                  src="/assets/icons/share.svg"
                  width={20}
                  height={20}
                  alt="share"
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
                <p className="text-[34px] text-secondary font-bold">{product?.currency} {formatNumber(product.currentPrice)}</p>
                <p className="text-[21px] text-black opacity-50 line-through">{product?.currency} {formatNumber(product.originalPrice)}</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <div className="product-stars">
                        <Image 
                            src="/assets/icons/star.svg"
                            width={16}
                            height={16}
                            alt="stars"
                        />
                        <p className="text-sm text-primary-orange font-semibold ">
                            {product.rating}
                        </p>
                    </div>
                    <div className="product-reviews">
                        <Image 
                            src="/assets/icons/comment.svg"
                            width={16}
                            height={16}
                            alt="reviews"
                        />
                        <p className="text-sm text-secondary font-semibold ">
                            {product.numberOfReviews} Reviews
                        </p>
                    </div>
                </div>
                <p className="text-sm opacity-50 text-black">
                    <span className="text-primary-green font-semibold">{product.feature}</span>
                </p>
            </div>
          </div>
          <div className="my-7 flexflex-col gap-5">
            <div className="flex gap-5 flex-wrap">
                <PriceInfoCard
                    title="Current Value"
                    icon="/assets/icons/price-tag.svg"
                    value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                />
                <PriceInfoCard
                    title="Average Value"
                    icon="/assets/icons/chart.svg"
                    value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                />
                <PriceInfoCard
                    title="Highest Value"
                    icon="/assets/icons/arrow-up.svg"
                    value={`${product.currency} ${formatNumber(product.highestPrice)}`}
                />
                <PriceInfoCard
                    title="Lowest Value"
                    icon="/assets/icons/arrow-down.svg"
                    value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
                />
            </div>
          </div>
          <Modal productId={id}/>
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">Product Description</h3>
          <div className="flex flex-col gap-4">
            {product?.description?.split('\n')}
          </div>
        </div>
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image 
            src="/assets/icons/bag.svg"
            alt="Bag"
            width={22}
            height={22}
          />
          <Link href="/" className="text-base text-white">Buy now</Link>
        </button>
      </div>
      {similiarProducts && similiarProducts.length > 0 && (
        <div className="py14 flex flex-col gap-2 w-full">
          <p className="section-text">Similiar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similiarProducts.map((product) => (
              <ProductCard key={product._id} product={product}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
