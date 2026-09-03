import React from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
// import { assets } from "../assets/assets";

const Footer = () => {
  //   const products = useState(ShopContext);
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Logo and Description */}
        <div>
          {/* <img src={assets.logo} className="mb-5 w-32" alt="Logo" />
           */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-extrabold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
              SNAZZYSHOP
            </div>
            <span className="w-2 h-2 bg-indigo-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
          </Link>
          <p className="w-full mt-2 md:w-2/3 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-000-000-0000</li>
            <li>iitiandev@gmail.com</li>
            <li className="cursor-pointer">Instagram</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <hr />
      <p className="py-5 text-sm text-center">
        Copyright 2025@ iitian.dev - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
