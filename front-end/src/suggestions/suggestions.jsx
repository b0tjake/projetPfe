import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
// import user from "../../../back-end/folders/models/user"

export default function Suggestions() {
const [userData, setUserData] = useState(null)
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

},[])
// console.log(`Image Path: http://localhost:5000/${userData.image}`);


    return(
        <h1>
            {userData ? `Welcome ${userData.username}` : "Please log in to see your suggestions"}
            {userData && <img src={`http://localhost:5000/${userData.image}`} alt="User Profile" />
        }

        </h1>
    )
}