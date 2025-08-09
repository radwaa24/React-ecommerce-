import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const NewProduct = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg shadow">
            <Skeleton height={250} />
            <Skeleton height={20} style={{ marginTop: "10px" }} />
            <Skeleton height={20} width={100} />
          </div>
        ))}
      </div>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 py-5">
          <button
            className="px-4  py-2 border border-gray-500 rounded hover:bg-gray-100"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filter.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-56 w-full object-contain mb-4"
              />
              <h5 className="text-lg font-semibold text-gray-800">
                {product.title.substring(0, 12)}...
              </h5>
              <p className="text-gray-600 text-sm mb-2">
                {product.description.substring(0, 90)}...
              </p>
              <p className="text-lg font-bold text-gray-900 mb-4">
                ${product.price}
              </p>

              <div className="grid lg:grid-cols-2 gap-2 w-full">
                <Link
                  to={`/product/${product.id}`}
                  className="px-2 text-center text-yellow-400 font-semibold bg-gray-800 no-underline py-2 rounded-lg hover:bg-gray-900 hover:text-yellow-300"
                >
                  Buy Now
                </Link>
                <button
                  onClick={() => {
                    toast.success("Added to cart");
                    addProduct(product);
                  }}
                  className="px-2 font-semibold text-green-300 bg-gray-800 py-2 rounded-lg hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 my-6">
      <h2 className="text-3xl font-bold text-center mb-4">Latest Products</h2>
      <hr className="mb-6" />
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default NewProduct;
