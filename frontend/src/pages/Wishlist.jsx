import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    currency,
    navigate,
    token,
  } = useContext(ShopContext);

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product._id)
  );

  if (!token) {
    return (
      <div className="border-t pt-14 text-center min-h-[50vh]">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"WISHLIST"} />
        </div>
        <p className="mt-8 text-gray-600">Please login to view your wishlist</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white text-sm my-6 px-8 py-3"
        >
          LOGIN
        </button>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 min-h-[50vh]">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"WISHLIST"} />
      </div>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">Your wishlist is empty</p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white text-sm my-6 px-8 py-3"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
          {wishlistProducts.map((item) => (
            <div key={item._id} className="border p-3 text-gray-700">
              <div className="relative overflow-hidden group">
                <Link to={`/product/${item._id}`}>
                  <img className="w-full hover:scale-110 transition ease-in-out" src={item.image[0]} alt="" />
                </Link>
                <button
                  onClick={() => toggleWishlist(item._id)}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow cursor-pointer hover:scale-110 transition"
                >
                  <img src={assets.wishlist_icon_filled} className="w-4" alt="" />
                </button>
              </div>
              <Link to={`/product/${item._id}`}>
                <p className="pt-3 text-sm font-medium line-clamp-1">{item.name}</p>
              </Link>
              <p className="text-sm font-medium mt-1">
                {currency}
                {item.price}
              </p>
              <button
                onClick={() => addToCart(item._id, item.sizes[0])}
                className="mt-3 w-full bg-black text-white text-xs py-2 active:bg-gray-700"
              >
                ADD TO CART
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;