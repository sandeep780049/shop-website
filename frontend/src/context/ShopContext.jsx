import { createContext, useCallback, useEffect, useState } from "react";
/* eslint-disable react-refresh/only-export-components -- context lives with provider in one file */
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [products,setProducts] = useState([]);
  const [token,setToken] = useState('')
  const navigate = useNavigate()

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if(token){
      try {
        
        axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
      } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if(token){
      try {
        
        await axios.post(backendUrl + '/api/cart/update',{itemId, size, quantity},{headers:{token}})
      } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      }
    }
  };

  
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };


  

  const getProductsData = useCallback(async () =>{
    try {
      
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        setProducts(response.data.products)
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }, [backendUrl])

  const getUserCart = useCallback(async (token) => {

    try {
      
      const response = await axios.post(backendUrl + '/api/cart/get' , {} , {headers:{token}})

      if(response.data.success){
        setCartItems(response.data.cartData)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }, [backendUrl])

  const loadWishlist = useCallback(async (token) => {

    try {
      
      const response = await axios.post(backendUrl + '/api/wishlist/get' , {} , {headers:{token}})

      if(response.data.success){
        setWishlist(response.data.wishlist)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }, [backendUrl])

  const toggleWishlist = async (itemId) => {
    if (!token) {
      toast.error("Please login to use your wishlist");
      navigate("/login");
      return;
    }

    const isWishlisted = wishlist.includes(itemId);

    // optimistic update
    setWishlist((prev) =>
      isWishlisted ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/toggle",
        { productId: itemId },
        { headers: { token } }
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
      } else {
        setWishlist((prev) =>
          isWishlisted ? [...prev, itemId] : prev.filter((id) => id !== itemId)
        );
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      setWishlist((prev) =>
        isWishlisted ? [...prev, itemId] : prev.filter((id) => id !== itemId)
      );
      toast.error(error.message);
    }
  };

  const getWishlistCount = () => wishlist.length;

  const isInWishlist = (itemId) => wishlist.includes(itemId);

  useEffect(()=>{
      // console.log(cartItems);
      getProductsData()

    },[getProductsData])

    useEffect(()=>{
      const storedToken = localStorage.getItem('token');
      if(storedToken){
        setToken(storedToken);
      }
    },[])

    useEffect(()=>{
      if(token){
        getUserCart(token);
        loadWishlist(token);
      } else {
        setWishlist([]);
      }
    },[token, getUserCart, loadWishlist])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    wishlist,
    setWishlist,
    toggleWishlist,
    getWishlistCount,
    isInWishlist,
    navigate,
    backendUrl,
    token,
    setToken
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
