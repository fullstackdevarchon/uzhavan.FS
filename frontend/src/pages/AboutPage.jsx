// src/pages/AboutPage.jsx
import React from 'react';
import PageContainer from "../components/PageContainer";

const AboutPage = () => {
  const productCategories = [
    {
      title: "Fruits",
      img: "https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,h_450,q_auto,w_710/f_auto/wip--21-healthiest-fruits-to-eat-in-2024-php3RGRfc",
      description: "Fresh and organic fruits sourced from local farms for quality and taste."
    },
    {
      title: "Vegetables",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgdqdu7X6uYyea_gKvcurHp6JmbclQOm-8EB_XJbOuydzmfaoeh7jzxF4_MUqTRkUxHDE&usqp=CAU",
      description: "Farm-fresh vegetables, packed with nutrients and perfect for daily meals."
    },
    {
      title: "Spices",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe4O51eBTIq4I6-lO-Ka-AHxof4uUG8EWTnQ&s",
      description: "A variety of spices to enhance the flavor of your dishes naturally."
    },
  ];

  return (
    <PageContainer>
      <main className="container mx-auto px-4 py-12">

        {/* About Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <hr className="border-gray-300 w-24 mx-auto mb-6" />
          <p className="text-black-900 text-lg leading-relaxed">
            Welcome to our store! We provide high-quality fresh produce, organic vegetables, and aromatic spices sourced directly from trusted farmers. 
            Our mission is to bring healthy, fresh, and flavorful ingredients to your kitchen. 
            Every product is carefully selected to ensure the best quality and taste. 
            We believe in sustainability, supporting local farmers, and delivering fresh produce to your doorstep.
          </p>
        </section>

        {/* Product Categories Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10">Our Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col"
              >
                <div className="overflow-hidden">
                  <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-56 object-cover transform hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <h5 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                    {category.title}
                  </h5>
                  <p className="text-gray-600 text-center text-sm md:text-base">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </PageContainer>
  );
};

export default AboutPage;
