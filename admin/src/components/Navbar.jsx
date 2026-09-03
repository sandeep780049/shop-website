import React from 'react'
// import {assets} from '../assets/assets'
import {Link} from 'react-router-dom'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      {/* <img className='w-[max(10%,80px)]' src={assets.logo} alt="" /> */}
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="text-2xl font-extrabold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
          SNAZZYSHOP
        </div>
        <span className="w-2 h-2 bg-indigo-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
      </Link>
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
