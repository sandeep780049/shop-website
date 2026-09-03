import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
// import { response } from "express";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchALlOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event,orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status',{orderId,status:event.target.value},{headers:{token}})

      if(response.data.success){
        await fetchALlOrders()
      }
    } catch (error) {
      console.log(error);
      // toast.error(response.data.message)
      // res.json({success:false,message:error.message})
    }
  }

  useEffect(() => {
    fetchALlOrders();
  }, [token]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Orders Page</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="border rounded-2xl p-4 shadow-md bg-white flex gap-6">
            <img src={assets.parcel_icon} alt="Parcel Icon" className="w-16 h-16 object-contain" />
            
            <div className="flex-1 space-y-3">
              {/* Items List */}
              <div className="text-gray-700">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quatity} <span className="text-sm text-gray-500">{item.size}</span>
                    {idx !== order.items.length - 1 && <span>, </span>}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="text-gray-600 text-sm">
                <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                <p>Phone: {order.address.phone}</p>
              </div>

              {/* Order Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <p>Items: <span className="font-medium">{order.items.length}</span></p>
                <p>Method: <span className="font-medium">{order.paymentMethod}</span></p>
                <p>Payment: <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-red-600'}`}>
                  {order.payment ? 'Done' : 'Pending'}
                </span></p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              {/* Amount & Status */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-semibold">{currency} {order.amount}</p>
                <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className="border rounded-lg px-3 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="Order Placed">Order Placed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Packed">Packed</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
