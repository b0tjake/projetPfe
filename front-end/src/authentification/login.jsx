import React, { useEffect, useState } from "react";
import "./login.css";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6"; 
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  // for gsap
  const [emailState, setEmailState] = useState(false);
  const [passState, setPassState] = useState(false);

  // for handleLogin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message,setMessage] = useState("")
  
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      console.log(res);

      if (res.data.token) {

        localStorage.setItem("token", res.data.token);


        navigate("/"); 
      }
    }  catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {

        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    gsap.to(".emailLabel", {
      top: emailState ? "-10px" : "",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [emailState]);

  useEffect(() => {
    gsap.to(".passLabel", {
      top: passState ? "-10px" : "",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [passState]);

  useEffect(() => {
    gsap.from(".card", {
      scale: 0,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(".card", {
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-full h-full card items-center md:items-stretch max-w-4xl p-2 md:h-3/4 bg-white rounded-2xl shadow-lg">
        {/* Left Side*/}
        <div className="hidden md:block w-1/2">
          <img
            src="/src/assets/images/tripImage.jfif"
            alt="trip"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Right Side*/}
        <div className="w-full md:w-1/2 p-4 flex flex-col p-8">
          <h1 className="text-3xl font-bold connection text-center text-gray-800">Welcome to Jouala</h1>
          <h3 className="text-2xl font-semibold sign text-gray-700 mt-4">Sign in</h3>

          <form className="mt-6" onSubmit={submit}>

            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-md peer"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailState(true)}
              />
              <label
                htmlFor="email"
                className="absolute emailLabel cursor-text left-4 top-3 text-gray-400 text-sm bg-white px-2 text-[17px]"
              >
                Email
              </label>
            </div>


            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-md peer"
                onChange={(e) => setPassword(e.target.value)} 
                onFocus={() => setPassState(true)}
              />
              <label
                htmlFor="password"
                className="absolute passLabel left-4 cursor-text top-3 text-gray-400 text-sm bg-white px-2 text-[17px]"
              >
                Password
              </label>
            </div>
            <div>
              <p className="pb-4 text-gray-500">
                Forgot your password?{" "}
                <a href="#" className="text-blue-600 font-medium">
                  Click here
                </a>
              </p>
            </div>

            <button className="w-full bg-[#00b69a] text-white py-3 rounded-md font-semibold hover:bg-[#14a48f] transition-all">
              Sign In
            </button>
            {message && <p className="text-red-500 text-center">{message}</p>}

          </form>

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
