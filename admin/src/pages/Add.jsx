import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast, ToastContainer } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // toast("Form Submitted")

    try {
      const formData = new FormData();
      // console.log(name,description,price,category,subCategory,bestseller,sizes)
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );
      // console.log(response.data);
      if (response.data.success) {
        toast.success("Product Added");
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2">
            <label htmlFor="image1">
              <img
                className="w-20"
                src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2">
              <img
                className="w-20"
                src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3">
              <img
                className="w-20"
                src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4">
              <img
                className="w-20"
                src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
            // value=""
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Product description</p>
          <textarea
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Write content here"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Product category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Sub category</p>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Product Price</p>
            <input
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
              // value=""
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            <div>
              <p
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("S")
                      ? prev.filter((s) => s !== "S")
                      : [...prev, "S"]
                  )
                }
                className={`${
                  sizes.includes("S") ? "bg-pink-200" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                S
              </p>
            </div>
            <div>
              <p
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("M")
                      ? prev.filter((s) => s !== "M")
                      : [...prev, "M"]
                  )
                }
                className={`${
                  sizes.includes("M") ? "bg-pink-200" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                M
              </p>
            </div>
            <div>
              <p
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("L")
                      ? prev.filter((s) => s !== "L")
                      : [...prev, "L"]
                  )
                }
                className={`${
                  sizes.includes("L") ? "bg-pink-200" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                L
              </p>
            </div>
            <div>
              <p
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XL")
                      ? prev.filter((s) => s !== "XL")
                      : [...prev, "XL"]
                  )
                }
                className={`${
                  sizes.includes("XL") ? "bg-pink-200" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                XL
              </p>
            </div>
            <div>
              <p
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XXL")
                      ? prev.filter((s) => s !== "XXL")
                      : [...prev, "XXL"]
                  )
                }
                className={`${
                  sizes.includes("XXL") ? "bg-pink-200" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                XXL
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            type="checkbox"
            id="bestseller"
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>

        <button
          type="submit"
          className="w-28 py-3 mt-4 bg-black text-white cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
