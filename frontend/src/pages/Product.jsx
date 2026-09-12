import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import Reviews from "../components/Reviews";

const Product = () => {
  const { productId } = useParams();
  // console.log(productId);
  const { products, currency, addToCart, backendUrl, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = useCallback(() => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        // console.log(item);
        setImage(item.image[0]);
        return null;
      }
    });
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Refresh rating info shown for this product after a review is submitted
  useEffect(() => {
    const handler = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/product/single", {
          productId,
        });
        if (response.data.success) {
          setProductData((prev) => ({ ...prev, ...response.data.product }));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    window.addEventListener("review-updated", handler);
    return () => window.removeEventListener("review-updated", handler);
  }, [productId, backendUrl]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full ">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer "
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* ---Product Info------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={
                  i <= Math.round(productData.avgRating)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt=""
                className="w-3.5"
              />
            ))}
            <p className="pl-2">({productData.ratingCount || 0})</p>
          </div>
          <p className="mt-3 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-3 text-gray-700 md:w-4/5 ">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 cursor-pointer ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>
          <button
            onClick={() => toggleWishlist(productData._id)}
            title={isInWishlist(productData._id) ? "Remove from wishlist" : "Add to wishlist"}
            className="ml-3 border border-gray-300 px-4 py-3 text-sm align-middle"
          >
            <img src={isInWishlist(productData._id) ? assets.wishlist_icon_filled : assets.wishlist_icon} className="w-5 inline-block" alt="" />
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-800 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---Descrption--------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review ({productData.ratingCount || 0})</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence.E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
        <Reviews productId={productId} />
      </div>
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0 "></div>
  );
};

export default Product;
