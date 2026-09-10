import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {backendUrl} from '../App'
import { toast } from 'react-toastify';

const Reviews = ({token}) => {

  const [reviews,setReviews] = useState([]);
  const [productMap,setProductMap] = useState({});

  const fetchData = async () =>{

    try {

      const response = await axios.post(backendUrl + '/api/review/list', {}, {headers:{token}})
      if(response.data.success){
        setReviews(response.data.reviews)
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
      
    }

  }

  const fetchProducts = async () =>{
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        const map = {}
        response.data.products.forEach(p => { map[p._id] = p.name })
        setProductMap(map)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const removeReview = async (id) =>{

    try {

     const response = await axios.post(backendUrl + '/api/review/admin-delete', {reviewId:id}, {headers:{token}}) 

     if(response.data.success){
      toast.success("Review Deleted")
      await fetchData()
     }else{
      toast.error(response.data.message)
     }

    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }

  }

  useEffect(()=>{
    fetchData()
    fetchProducts()
  },[])

  const formatDate = (ms) =>
    new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <>
      <p className='mb-2' >All Product Reviews</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_2fr_1fr_1fr] items-center py-1 px-2 border bg-gray text-sm'>
          <b>Product</b>
          <b>User</b>
          <b className='text-center'>Rating</b>
          <b>Review</b>
          <b>Date</b>
          <b className='text-center'>Action</b>
        </div>

        {
          reviews.length === 0 ? (
            <p className='text-sm border px-2 py-4'>No reviews yet</p>
          ) : (
            reviews.map((item,index)=>(
              <div className='grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1fr_2fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                <p>{productMap[item.productId] || item.productId}</p>
                <p>{item.name}</p>
                <p className='md:text-center'>{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</p>
                <p className='break-words'>{item.comment}</p>
                <p className='hidden md:block'>{formatDate(item.date)}</p>
                <p onClick={()=>removeReview(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
              </div>
            ))
          )
        }
      </div>
    </>
  )
}

export default Reviews