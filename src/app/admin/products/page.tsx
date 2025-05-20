"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { MdCloudUpload } from "react-icons/md";
import useCategories from "@/hooks/useCategories";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProductForm() {
  const { categories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    images: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("regularPrice", product.regularPrice);
    formData.append("discountPrice", product.discountPrice);

    product.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("Products add successfuly");
        setProduct({
          name: "",
          category: "",
          description: "",
          regularPrice: "",
          discountPrice: "",
          images: [],
        });
      } else {
        const error = await res.json();
        toast.error("Error: " + error.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" ">
      <h2 className="text-2xl font-bold mb-6 text-start">Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-6 "
      >
        {/* LEFT SIDE – FORM INPUTS */}
        <div className="flex-1  p-6 rounded-xl shadow space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />

          <select
            className="w-full border p-2 rounded"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Product Description"
            className="w-full border p-2 rounded"
            rows={4}
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Regular Price"
              className="w-full border p-2 rounded"
              value={product.regularPrice}
              onChange={(e) =>
                setProduct({ ...product, regularPrice: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Discount Price"
              className="w-full border p-2 rounded"
              value={product.discountPrice}
              onChange={(e) =>
                setProduct({ ...product, discountPrice: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* RIGHT SIDE – IMAGE & BUTTONS */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow space-y-4 flex flex-col">
          <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-600">
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center cursor-pointer hover:text-orange-500"
            >
              <MdCloudUpload className="text-3xl mb-1" />
              <span>Upload Images</span>
              <span className="mt-2 px-4 py-1 border rounded bg-gray-100">
                Browse Files
              </span>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const newFiles = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                setProduct((prev) => ({
                  ...prev,
                  images: [...prev.images, ...newFiles],
                }));
              }}
              required
            />
          </div>

          {/* Image Preview Grid */}
          {product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((file, index) => (
                <div
                  key={index}
                  className="w-full h-20 relative border rounded overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-[#0f766e] cursor-pointer text-white py-2 rounded w-full font-semibold flex items-center justify-center"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
