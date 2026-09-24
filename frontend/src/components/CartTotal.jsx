import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ showCoupon = false }) => {

    const {currency,delivery_fee,getCartAmount,appliedCoupon} = useContext(ShopContext);

    const subtotal = getCartAmount();
    const discount = appliedCoupon && subtotal > 0 ? appliedCoupon.discount : 0;
    const total = subtotal === 0 ? 0 : Math.max(subtotal - discount + delivery_fee, 0);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />   

      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>SubTotal</p>
            <p>{currency}{subtotal}.00 </p>
        </div>
        {discount > 0 && (
          <>
            <hr />
            <div className='flex justify-between text-green-600'>
                <p>Coupon ({appliedCoupon.code})</p>
                <p>-{currency}{discount}.00 </p>
            </div>
          </>
        )}
        <hr />
        <div className='flex justify-between'>
            <p>Shipping Fee</p>
            <p>{currency}{delivery_fee}.00 </p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <b>TOTAL</b>
            <b>{currency}{total}.00</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
