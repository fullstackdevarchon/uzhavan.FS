import React from "react";
import PageContainer from "../components/PageContainer";
import { Mail, Phone, MapPin } from "lucide-react"; // icons

const ContactPage = () => {
  return (
    <PageContainer>
      <main>
        <section className="container mx-auto px-6 py-20">
          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
              Contact Us
            </h1>
            <hr className="border-gray-300 w-24 mx-auto mb-6" />
            <p className="text-gray-600 text-lg">
              We’d love to hear from you. Reach out with any questions, feedback, or just to say hello.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Contact Info Card */}
            <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 flex flex-col justify-center space-y-8 border border-gray-200">
              <div className="flex items-center space-x-5">
                <div className="p-4 bg-indigo-600 text-white rounded-full shadow-md">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Our Office</h3>
                  <p className="text-gray-600">123 Market Street, New York, USA</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <div className="p-4 bg-indigo-600 text-white rounded-full shadow-md">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <div className="p-4 bg-indigo-600 text-white rounded-full shadow-md">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Email</h3>
                  <p className="text-gray-600">support@example.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 space-y-6 border border-gray-200">
              <div className="flex flex-col">
                <label htmlFor="Name" className="mb-2 font-semibold text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  id="Name"
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="Email" className="mb-2 font-semibold text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  placeholder="name@example.com"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="Message" className="mb-2 font-semibold text-gray-800">
                  Message
                </label>
                <textarea
                  id="Message"
                  rows={5}
                  placeholder="Enter your message"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled
                  className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </PageContainer>
  );
};

export default ContactPage;
