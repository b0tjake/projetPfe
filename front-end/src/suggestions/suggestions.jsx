import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import user from "../../../back-end/folders/models/user"

export default function Suggestions() {
const [userData, setUserData] = useState(null)
const navi = useNavigate()
useEffect(() => {
    const token = localStorage.getItem("token")
    if(token){
        const decoded = jwtDecode(token);
        console.log('username : ' ,decoded.username )
        console.log('fullname : ' ,decoded.fullname )
        console.log('email : ' ,decoded.email )
        console.log('image : ' ,decoded.image )
        setUserData(decoded)
    }
    else {
        setTimeout(() => {
            navi("/login")
        },)
    }

},[])
// console.log(`Image Path: http://localhost:5000/${userData.image}`);


    return(
        <h1>
            {userData ? `Welcome ${userData.username}` : "Please log in to see your suggestions"}

            {userData && <img className="w-10 h-10 rounded-full" src={`http://localhost:5000/${userData.image}`} alt="User Profile" />
        }
        </h1>
    )
}