import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import { FaStar, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart({
      id: product._id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image?.url || "",
      description: product.description,
      qty: 1,
    }));
    toast.success("Added to cart!");
  };

  // Fetch main product
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/v1/products/${id}`)
      .then(res => {
        if (res.data.success) {
          setProduct(res.data.product);
        }
      })
      .catch(err => {
        console.error("❌ Product fetch error:", err);
        toast.error("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch similar products
  useEffect(() => {
    if (!product?.category) return;
    setLoadingSimilar(true);
    axios.get(`http://localhost:5000/api/v1/products/similar/${product.category._id}/${product._id}`)
      .then(res => {
        if (res.data.success) setSimilarProducts(res.data.products);
      })
      .catch(err => console.error("❌ Similar products fetch error:", err))
      .finally(() => setLoadingSimilar(false));
  }, [product]);

  // Loading skeletons
  const Loading = () => (
    <div className="flex flex-col md:flex-row gap-8 animate-pulse mt-12">
      <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="flex flex-col md:flex-row gap-12 mt-12">
      <div className="w-full md:w-1/2 flex justify-center">
        {product?.image?.url ? (
          <div className="w-96 h-96 flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-50">
            <img
              className="w-full h-full object-cover"
              src={product.image.url}
              alt={product.name}
              loading="lazy"
            />
          </div>
        ) : <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="uppercase text-gray-500 tracking-wide mb-2">{product?.category?.name}</p>
        <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
        <p className="flex items-center text-yellow-500 mb-4">
          {product?.rating || "4.5"} <FaStar className="ml-2" />
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ₹ {product?.price}{" "}
          <span className="text-lg font-medium text-gray-500">({product?.weight})</span>
        </h2>

        <p className="text-gray-600 mb-6">{product?.description}</p>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition flex items-center gap-2"
            onClick={() => addProduct(product)}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const LoadingSimilar = () => (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="w-64 h-80 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );

  const ShowSimilarProducts = () => (
    <div className="flex gap-6 py-6">
      {similarProducts.map(item => (
        <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition flex flex-col w-64 group">
          <div className="flex justify-center bg-gray-50 p-4">
            <div className="w-40 h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={item.image?.url || "/images/placeholder.png"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
            <p className="text-lg font-bold text-gray-900 mb-4">
              ₹ {item.price} <span className="text-sm font-medium text-gray-500">({item.weight})</span>
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to={`/buyer-dashboard/product/${item._id}`}
                className="px-4 py-2 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                <FaCreditCard className="inline mr-2" /> Buy Now
              </Link>
              <button
                onClick={() => addProduct(item)}
                className="px-4 py-2 text-center border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <FaShoppingCart className="inline mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-12">
      {loading ? <Loading /> : <ShowProduct />}

      {product && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <Marquee pauseOnHover pauseOnClick speed={50}>
            {loadingSimilar ? <LoadingSimilar /> : <ShowSimilarProducts />}
          </Marquee>
        </div>
      )}
    </section>
  );
};

export default Product;
