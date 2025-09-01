import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import { FaStar, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import toast from "react-hot-toast";

// ✅ Import local products JSON (with weight field included)
import productsData from "../../data/products.json";

const Product = () => {
  const { id } = useParams(); // 👈 Route param (e.g., "2")
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart!");
    console.log("✅ Added to cart:", product);
  };

  useEffect(() => {
    console.log("🔍 useParams ID:", id);

    setLoading(true);
    setLoading2(true);

    setTimeout(() => {
      // ✅ Ensure ID comparison works as string
      const foundProduct = productsData.find(
        (item) => String(item.id) === String(id)
      );

      console.log("📦 Found Product:", foundProduct);

      setProduct(foundProduct || {});
      setLoading(false);

      if (foundProduct?.category) {
        const related = productsData.filter(
          (item) =>
            item.category.toLowerCase() ===
              foundProduct.category.toLowerCase() &&
            item.id !== foundProduct.id
        );
        console.log("✨ Similar Products:", related);
        setSimilarProducts(related);
      }
      setLoading2(false);
    }, 400);
  }, [id]);

  // 🔹 Loading skeleton for main product
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

  // 🔹 Main product display
  const ShowProduct = () => (
    <div className="flex flex-col md:flex-row gap-12 mt-12">
      {/* Product Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        {product?.image ? (
          <div className="w-96 h-96 flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-50">
            <img
              className="w-full h-full object-cover"
              src={product.image}
              alt={product.title || "Product"}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="uppercase text-gray-500 tracking-wide mb-2">
          {product?.category}
        </p>
        <h1 className="text-3xl font-bold mb-4">{product?.title}</h1>
        <p className="flex items-center text-yellow-500 mb-4">
          {product?.rating?.rate || "4.5"}
          <FaStar className="ml-2" />
        </p>

        {/* ✅ Price + Weight */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ₹ {product?.price}{" "}
          <span className="text-lg font-medium text-gray-500">
            ({product?.weight})
          </span>
        </h2>

        <p className="text-gray-600 mb-6">{product?.description}</p>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition flex items-center gap-2"
            onClick={() => addProduct(product)}
          >
            <FaShoppingCart /> Add to Cart
          </button>
          <Link
            to="/buyer-dashboard/cart"
            className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg shadow-md hover:bg-gray-900 hover:text-white transition"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );

  // 🔹 Loading skeleton for similar products
  const Loading2 = () => (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="w-64 h-80 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );

  // 🔹 Similar products display
  const ShowSimilarProduct = () => (
    <div className="flex gap-6 py-6">
      {similarProducts.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md hover:shadow-2xl transition overflow-hidden relative flex flex-col w-64 group"
        >
          {/* Image */}
          <div className="flex justify-center bg-gray-50 p-4">
            <div className="w-40 h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={item.image || "/images/placeholder.png"}
                alt={item.title || "Similar product"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
              {item.title}
            </h3>

            {/* ✅ Price + Weight */}
            <p className="text-lg font-bold text-gray-900 mb-4">
              ₹ {item.price}{" "}
              <span className="text-sm font-medium text-gray-500">
                ({item.weight})
              </span>
            </p>

            <div className="flex flex-col gap-2">
              {/* ✅ Correct route param */}
              <Link
                to={`/buyer-dashboard/product/${item.id}`}
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
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <Marquee pauseOnHover pauseOnClick speed={50}>
          {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
        </Marquee>
      </div>
    </section>
  );
};

export default Product;
