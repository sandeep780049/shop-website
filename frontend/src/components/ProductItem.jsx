import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price,avgRating=0,ratingCount=0}) => {

    const {currency} = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer ' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      {ratingCount > 0 && (
        <div className='flex items-center gap-1 pb-1'>
          <div className='flex items-center'>
            {[1, 2, 3, 4, 5].map((i) => (
              <img key={i} src={i <= Math.round(avgRating) ? assets.star_icon : assets.star_dull_icon} className='w-3' alt="" />
            ))}
          </div>
          <span className='text-xs text-gray-500'>({ratingCount})</span>
        </div>
      )}
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
