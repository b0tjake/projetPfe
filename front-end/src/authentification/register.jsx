import React, { useEffect, useState, useRef } from "react";
// import "./register.css";
import { FaGoogle, FaFacebookF, FaXTwitter, FaImage, FaUser } from "react-icons/fa6"; 
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register({setLoading}) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  //for gsap
  const [userState, setUserState] = useState(false);
  const [fullNameState, setFullNameState] = useState(false);
  const [emailState, setEmailState] = useState(false);
  const [passState, setPassState] = useState(false);

  //data work
  const [fullname , setFullname] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [username , setUsername] = useState("");
  const [image , setImage] = useState("");
  const [message , setMessage] = useState("");
  const [error , setError] = useState("");
  
  const navi = useNavigate()

const Submit = async(e) => {
  e.preventDefault()
  const formData = new FormData();
formData.append("fullname", fullname);
formData.append("email", email);
formData.append("password", password);
formData.append("username", username);
formData.append("image", image); // file

try {
  const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

    console.log(res)
    setMessage(res.data.message)
    setTimeout(() => {
    setLoading(true)
    }, 2000)
    setError("");
    // console.log(message)
    setTimeout(()=> {
      navi("/login")
      setLoading(false)
    },3500)
  }
  catch(error){
    console.log(error.response.data.message);
    setError(error.response.data.message);
  }
}

  useEffect(() => {
    gsap.to(".userLabel", { top: userState ? "-10px" : "", duration: 0.3, ease: "power2.out" });
  }, [userState]);

  useEffect(() => {
    gsap.to(".fullNameLabel", { top: fullNameState ? "-10px" : "", duration: 0.3, ease: "power2.out" });
  }, [fullNameState]);

  useEffect(() => {
    gsap.to(".emailLabel", { top: emailState ? "-10px" : "", duration: 0.3, ease: "power2.out" });
  }, [emailState]);

  useEffect(() => {
    gsap.to(".passLabel", { top: passState ? "-10px" : "", duration: 0.3, ease: "power2.out" });
  }, [passState]);

  useEffect(() => {
    gsap.from(".card", {
        scale:0,
        duration:0.8,
        ease:"power2.out",
    })
    gsap.to(".card", {
        scale:1,
        duration:0.8,
        ease:"power2.out",
    })
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center text-black items-center h-screen bg-gray-100">
      <div className="flex w-full card items-center md:items-stretch max-w-4xl p-2 pt-6 md:pt-2 h-full md:h-[90%] bg-white rounded-2xl shadow-lg">
        {/* Left Side */}

        <div className="w-full md:w-1/2  flex h-fit  flex-col px-5  ">
          <h1 className="text-3xl font-bold connection text-center text-gray-800">Join Jouala</h1>
          <p className="text-gray-500 text-center text-[16px] py-1 pt-2">join Jouala community now.</p>

          <h3 className="text-2xl font-semibold sign text-gray-700 mt-4">Sign Up</h3>

          <form className="mt-6" onSubmit={Submit}>
            <div className="relative mb-4">
              <input type="text"  id="username" placeholder=" " className="w-full px-4 py-3 border border-gray-300 rounded-md peer" onChange={(e) => setUsername(e.target.value)} onFocus={() => setUserState(true)} />
              <label htmlFor="username" className="absolute userLabel cursor-text left-4 top-3 text-gray-400 text-sm bg-white px-2 text-[17px]">Username</label>
            </div>

            <div className="relative mb-4">
              <input type="text" id="fullname" placeholder=" " className="w-full px-4 py-3 border border-gray-300 rounded-md peer" onChange={(e) => setFullname(e.target.value)} onFocus={() => setFullNameState(true)} />
              <label htmlFor="fullname" className="absolute fullNameLabel cursor-text left-4 top-3 text-gray-400 text-sm bg-white px-2 text-[17px]">Full Name</label>
            </div>

            <div className="relative mb-4">
              <input type="email" id="email" placeholder=" " className="w-full px-4 py-3 border border-gray-300 rounded-md peer" onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailState(true)} />
              <label htmlFor="email" className="absolute emailLabel cursor-text left-4 top-3 text-gray-400 text-sm bg-white px-2 text-[17px]">Email</label>
            </div>

            <div className="relative mb-4">
              <input type="password" id="password" placeholder=" " className="w-full px-4 py-3 border border-gray-300 rounded-md peer" onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassState(true)} />
              <label htmlFor="password" className="absolute passLabel left-4 cursor-text top-3 text-gray-400 text-sm bg-white px-2 text-[17px]">Password</label>
            </div>

            <div className="mb-4">
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              <div 
                onClick={() => fileInputRef.current.click()}
                className="relative cursor-pointer group"
              >
                <div className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${
                  previewImage ? 'border-[#00b69a]' : 'border-gray-300 hover:border-[#00b69a]'
                }`}>
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <FaImage className="text-white text-2xl" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#00b69a] bg-opacity-10 rounded-full p-3 mb-2">
                        <FaUser className="text-[#00b69a] text-xl" />
                      </div>
                      <p className="text-sm text-gray-500">Click to upload profile picture</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button className="w-full bg-[#00b69a] text-white py-3 mt-3 rounded-md font-semibold hover:bg-[#14a48f] transition-all">
              Sign Up
            </button>
            <p className="text-center text-red-500 mt-2">{error}</p>
            <p className="text-center text-green-500 mt-2">{message}</p>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account? <a href="login" className="text-blue-600 font-semibold">Sign in</a>
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
         {/* Right Side   */}
        <div className="hidden md:block w-1/2">
          <img src="/src/assets/images/tripRegister.jfif" alt="trip" className="w-full h-full object-cover rounded-2xl" />
        </div>

      </div>
    </div>
  );
}
