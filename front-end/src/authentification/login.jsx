import React, { useEffect, useState } from "react";
import "./login.css";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6"; 
import gsap from "gsap";

export default function Login() {
  const [emailState, setEmailState] = useState(false);
  const [passState, setPassState] = useState(false);

  useEffect(() => {
    gsap.to(".emailLabel", {
      top: emailState ? "-10px" :"",
      duration: 0.3,
      ease: "power2.out"
    });
  }, [emailState]);

  useEffect(() => {
    gsap.to(".passLabel", {
      top: passState ? "-10px" : "10x",
      duration: 0.3,
      ease: "power2.out"
    });
  }, [passState]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-full h-full items-center md:items-stretch max-w-4xl p-2 md:h-3/4 bg-white rounded-2xl shadow-lg">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2">
          <img src="/src/assets/images/tripImage.jfif" alt="trip" className="w-full h-full object-cover rounded-2xl" />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-4 flex flex-col p-8">
          <h1 className="text-3xl font-bold connection text-center text-gray-800">Welcome to Jouala</h1>
          <h3 className="text-2xl font-semibold sign text-gray-700 mt-4">Sign in</h3>

          <form className="mt-6">
            {/* Input Field 1 */}
            <div className="relative mb-4">
              <input
                type="text"
                id="email"
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-md peer"
                onFocus={() => setEmailState(true)}
                // onBlur={() => setEmailState(false)}
              />
              <label
                htmlFor="email"
                className="absolute emailLabel cursor-text left-4 top-3 text-gray-400 text-sm bg-white px-2 text-[17px]"
              >
                Email
              </label>
            </div>

            {/* Input Field 2 */}
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-md peer"
                onFocus={() => setPassState(true)}
                // onBlur={() => setPassState(false)}
              />
              <label
                htmlFor="password"
                className="absolute passLabel left-4 cursor-text top-3 text-gray-400 text-sm bg-white px-2 text-[17px]"
              >
                Password
              </label>
            </div>

            {/* Forgot Password */}
            <div>
              <p className="pb-4 text-gray-500">
                Forgot your password?{" "}
                <a href="#" className="text-blue-600 font-medium">
                  Click here
                </a>
              </p>
            </div>

            {/* Sign In Button */}
            <button className="w-full bg-[#00b69a] text-white py-3 rounded-md font-semibold hover:bg-[#14a48f] transition-all">
              Sign In
            </button>
          </form>

          {/* Bottom Text */}
          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="register" className="text-blue-600 font-semibold">
              Sign up
            </a>
          </p>

          <div className="flex justify-center pt-3">
            <hr className="mt-3 w-1/3" />
            <p className="text-gray-500 mx-2">or</p>
            <hr className="mt-3 w-1/3" />
          </div>

          <div className="mt-2 flex justify-center gap-3">
            <button className="p-3 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-100 transition-all">
              <FaGoogle className="text-red-500" /> 
            </button>

            <button className="p-3 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-100 transition-all">
              <FaFacebookF className="text-blue-600" />
            </button>

            <button className="p-3 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-100 transition-all">
              <FaXTwitter className="text-black" /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
