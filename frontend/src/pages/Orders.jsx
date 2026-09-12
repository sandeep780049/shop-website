import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const ORDER_STATUSES = ['Order Placed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered']

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([])

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })

      if (response.data.success) {
        setOrders([...response.data.orders].reverse())
      }

    } catch (error) {
      console.log(error);

    }
  }, [backendUrl, token])

  const statusHistoryFor = (order) =>
    Array.isArray(order.statusHistory) && order.statusHistory.length > 0
      ? order.statusHistory
      : [{ status: order.status, date: order.date }]

  const currentStatusIndex = (order) =>
    Math.max(ORDER_STATUSES.indexOf(order.status), 0)

  useEffect(() => {
    loadOrderData()
  }, [loadOrderData])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div className='flex flex-col gap-6'>
        {
          orders.map((order, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700'>
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                <div className='flex flex-col gap-4'>
                  {
                    order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className='flex items-start gap-4 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-2 mt-2 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity : {item.quatity}</p>
                            <p>Size : {item.size}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className='text-sm md:text-right'>
                  <p>Order date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{order.paymentMethod}{order.payment ? '' : ' (pending)'}</span></p>
                  <p className='mt-1'>Total: <span className='font-medium'>{currency}{order.amount}</span></p>
                  <p className='mt-1'>Status: <span className='text-green-600 font-medium'>{order.status}</span></p>
                </div>
              </div>

              <div className='mt-6 flex flex-wrap justify-between gap-y-4'>
                {
                  ORDER_STATUSES.map((status, stepIndex) => {
                    const active = stepIndex <= currentStatusIndex(order)
                    const entry = statusHistoryFor(order).find(h => h.status === status)
                    return (
                      <div key={status} className='flex flex-col items-center gap-1 w-[72px]'>
                        <div className={`w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <p className={`text-xs text-center ${active ? 'text-green-700 font-medium' : 'text-gray-400'}`}>{status}</p>
                        {entry && <p className='text-[10px] text-gray-400'>{new Date(entry.date).toLocaleDateString()}</p>}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders