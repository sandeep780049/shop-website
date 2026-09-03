import React from 'react'

const NewLetterbox = () => {
    const onSubmitHandler=(event)=>{
        event.preventDefault();
        console.log('Clicked');
    }
    return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='mt-3 text-gray-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, voluptatem? Laborum impedit quo itaque enim!</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' action="">
        <input className='w-full sm:flex-1 outline-none' placeholder='Enter Your Email' type="email" />
        <button type='submit' className='bg-black text-white text-xs py-4 px-10 '>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewLetterbox
